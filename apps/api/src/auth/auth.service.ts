import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from '@node-rs/argon2';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@sis/api-contracts';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists.');
    }

    // Argon2id password hash
    const passwordHash = await argon2.hash(dto.password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Find default USER role
    const userRole = await this.prisma.role.findUnique({
      where: { name: UserRole.USER },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        fullName: dto.fullName,
        passwordHash,
        status: 'ACTIVE',
        securityScore: 85,
        userRoles: userRole
          ? {
              create: {
                roleId: userRole.id,
              },
            }
          : undefined,
      },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    // Record Audit Log
    await this.prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        actorEmail: user.email,
        action: 'USER_REGISTERED',
        resourceType: 'User',
        resourceId: user.id,
        outcome: 'SUCCESS',
        ipAddress,
        userAgent,
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        mfaFactors: true,
      },
    });

    if (!user) {
      await this.recordLoginEvent(null, dto.email, false, 'Invalid credentials', ipAddress, userAgent);
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      await this.recordLoginEvent(user.id, dto.email, false, 'Account suspended', ipAddress, userAgent);
      throw new UnauthorizedException('Account suspended. Please contact enterprise security administration.');
    }

    // Verify Argon2id password
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      await this.recordLoginEvent(user.id, dto.email, false, 'Password mismatch', ipAddress, userAgent);
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Check MFA requirement
    if (user.isMfaEnabled) {
      const activeMfa = user.mfaFactors.find((m) => m.type === 'TOTP' && m.isVerified);
      if (activeMfa) {
        if (!dto.mfaCode) {
          // Return partial response signaling MFA required
          const tempToken = this.jwtService.sign(
            { sub: user.id, stage: 'mfa_required' },
            { expiresIn: '5m' },
          );
          return {
            mfaRequired: true,
            tempToken,
            message: 'Multi-Factor Authentication code required.',
          };
        }

        const isValidTotp = authenticator.verify({
          token: dto.mfaCode,
          secret: activeMfa.secret,
        });

        if (!isValidTotp) {
          await this.recordLoginEvent(user.id, dto.email, false, 'Invalid MFA TOTP', ipAddress, userAgent);
          throw new UnauthorizedException('Invalid Multi-Factor Authentication code.');
        }
      }
    }

    // Create new Database Session
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        ipAddress,
        userAgent,
        deviceType: this.resolveDeviceType(userAgent),
        expiresAt,
      },
    });

    // Update user login timestamp
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    await this.recordLoginEvent(user.id, dto.email, true, undefined, ipAddress, userAgent);

    // Sign JWT Token
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      sessionId: session.id,
      roles,
    });

    return {
      accessToken,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions,
        isMfaEnabled: user.isMfaEnabled,
        securityScore: user.securityScore,
      },
    };
  }

  async setupMfa(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found.');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'SIS-Cyber-Fortress', secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Upsert TOTP factor
    await this.prisma.mfaFactor.deleteMany({
      where: { userId, isVerified: false },
    });

    await this.prisma.mfaFactor.create({
      data: {
        userId,
        type: 'TOTP',
        secret,
        isVerified: false,
      },
    });

    return {
      secret,
      qrCodeDataUrl,
      instructions: 'Scan this QR code with Google Authenticator, Authy, or 1Password, then verify with the 6-digit code.',
    };
  }

  async verifyMfaSetup(userId: string, code: string) {
    const factor = await this.prisma.mfaFactor.findFirst({
      where: { userId, type: 'TOTP', isVerified: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!factor) {
      throw new BadRequestException('No pending MFA setup found. Please request MFA setup first.');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: factor.secret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid verification code. Please check your authenticator clock and try again.');
    }

    // Activate MFA
    await this.prisma.$transaction([
      this.prisma.mfaFactor.update({
        where: { id: factor.id },
        data: { isVerified: true },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { isMfaEnabled: true, securityScore: 98 },
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId: userId,
          action: 'MFA_ENABLED',
          resourceType: 'User',
          resourceId: userId,
          outcome: 'SUCCESS',
        },
      }),
    ]);

    return { success: true, message: 'Multi-Factor Authentication enabled successfully.' };
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isRevoked: false },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new BadRequestException('Session not found or already terminated.');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    return { success: true, message: 'Session revoked successfully.' };
  }

  async revokeAllOtherSessions(userId: string, currentSessionId: string) {
    await this.prisma.session.updateMany({
      where: {
        userId,
        id: { not: currentSessionId },
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    return { success: true, message: 'All other sessions have been terminated.' };
  }

  private resolveDeviceType(userAgent?: string): string {
    if (!userAgent) return 'Web Browser';
    if (/mobile/i.test(userAgent)) return 'Mobile Device';
    if (/tablet/i.test(userAgent)) return 'Tablet Device';
    return 'Desktop Workstation';
  }

  private async recordLoginEvent(
    userId: string | null,
    email: string,
    isSuccess: boolean,
    failReason?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      await this.prisma.loginEvent.create({
        data: {
          userId,
          email,
          isSuccess,
          failReason,
          ipAddress,
          userAgent,
          isSuspicious: !isSuccess && failReason === 'Invalid MFA TOTP',
        },
      });
    } catch (e) {
      this.logger.warn(`Failed to record login event: ${e}`);
    }
  }
}

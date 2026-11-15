import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['sis_access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'sis_cyber_fortress_super_secret_jwt_key_2026_change_in_production',
    });
  }

  async validate(payload: { sub: string; sessionId: string; email: string }) {
    // 1. Verify session validity in database
    if (payload.sessionId) {
      const session = await this.prisma.session.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session || session.isRevoked || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session has been revoked or expired. Please re-authenticate.');
      }

      // Update session last active time
      await this.prisma.session.update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() },
      });
    }

    // 2. Fetch full user with roles and permissions
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        moduleAssignments: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User account no longer exists.');
    }

    if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
      throw new UnauthorizedException('User account is currently suspended.');
    }

    // Aggregate unique roles & permissions
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissionsSet = new Set<string>();

    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        if (rp.permission?.key) {
          permissionsSet.add(rp.permission.key);
        }
      }
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      isMfaEnabled: user.isMfaEnabled,
      roles,
      permissions: Array.from(permissionsSet),
      moduleAssignments: user.moduleAssignments.map((ma) => ma.moduleKey),
      sessionId: payload.sessionId,
    };
  }
}

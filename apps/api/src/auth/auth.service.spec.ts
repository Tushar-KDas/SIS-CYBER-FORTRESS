import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from '@node-rs/argon2';

describe('AuthService (Unit Tests)', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      auditLog: {
        create: jest.fn(),
      },
      loginEvent: {
        create: jest.fn(),
      },
      mfaFactor: {
        deleteMany: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((actions) => Promise.all(actions)),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token_2026'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'existing@corp.com' });

      await expect(
        service.register({
          email: 'existing@corp.com',
          fullName: 'Test User',
          password: 'Password#1234',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully hash password with Argon2id and create user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue({ id: 'role-user', name: 'USER' });
      prisma.user.create.mockImplementation(({ data }: any) => {
        return Promise.resolve({
          id: 'new-user-id',
          email: data.email,
          fullName: data.fullName,
          status: data.status,
          userRoles: [{ role: { name: 'USER' } }],
        });
      });

      const result = await service.register({
        email: 'analyst@corp.com',
        fullName: 'Analyst One',
        password: 'Strong#Password2026!',
      });

      expect(result.email).toBe('analyst@corp.com');
      expect(result.roles).toContain('USER');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for non-existent email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ghost@corp.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const realHash = await argon2.hash('Correct#Password123');
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@corp.com',
        passwordHash: realHash,
        status: 'ACTIVE',
        userRoles: [{ role: { name: 'USER', rolePermissions: [] } }],
        mfaFactors: [],
      });

      await expect(
        service.login({ email: 'test@corp.com', password: 'WrongPassword999!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return accessToken and create session on valid credentials', async () => {
      const pass = 'Correct#Password123';
      const realHash = await argon2.hash(pass);
      prisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        email: 'test@corp.com',
        fullName: 'Test User',
        passwordHash: realHash,
        status: 'ACTIVE',
        isMfaEnabled: false,
        securityScore: 85,
        userRoles: [{ role: { name: 'USER', rolePermissions: [] } }],
        mfaFactors: [],
      });
      prisma.session.create.mockResolvedValue({ id: 'sess-1' });

      const result: any = await service.login({ email: 'test@corp.com', password: pass });

      expect(result.accessToken).toBe('mock_jwt_token_2026');
      expect(result.user.email).toBe('test@corp.com');
      expect(prisma.session.create).toHaveBeenCalled();
    });
  });
});

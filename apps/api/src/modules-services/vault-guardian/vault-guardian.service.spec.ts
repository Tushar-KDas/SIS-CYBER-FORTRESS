import { Test, TestingModule } from '@nestjs/testing';
import { VaultGuardianService } from './vault-guardian.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('VaultGuardianService (Zero-Knowledge Architecture & Audit Logs)', () => {
  let service: VaultGuardianService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      vaultItem: {
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'vault-item-1', ...data })),
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        update: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'vault-item-1', ...data })),
        delete: jest.fn().mockResolvedValue({ id: 'vault-item-1' }),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'audit-log-1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VaultGuardianService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VaultGuardianService>(VaultGuardianService);
  });

  describe('Zero-Knowledge Invariant Enforcement', () => {
    it('should reject items missing required AES-256-GCM cryptographic parameters (authTag, iv, or salt)', async () => {
      // Missing authTag
      await expect(
        service.create('user-1', {
          title: 'AWS Secret Key',
          category: 'API_KEY',
          ciphertext: 'dGhpcyBpcyBzZWNyZXQ=',
          iv: 'MDEyMzQ1Njc4OWFiY2RlZg==',
          salt: 'c2FsdHNhbHQ=',
          authTag: '',
        }),
      ).rejects.toThrow(BadRequestException);

      // Missing ciphertext
      await expect(
        service.create('user-1', {
          title: 'Database Password',
          category: 'PASSWORD',
          ciphertext: '',
          iv: 'MDEyMzQ1Njc4OWFiY2RlZg==',
          salt: 'c2FsdHNhbHQ=',
          authTag: 'dGFndGFn',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should save fully encrypted payload and record an audit log without plaintext', async () => {
      const payload = {
        title: 'Master Recovery Key',
        category: 'SECURE_NOTE',
        ciphertext: '5a443a656e63727970746564',
        iv: '0123456789abcdef',
        salt: '9876543210fedcba',
        authTag: 'aabbccddeeff0011',
      };

      const result = await service.create('user-100', payload);

      expect(prisma.vaultItem.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-100',
          title: payload.title,
          category: payload.category,
          ciphertext: payload.ciphertext,
          iv: payload.iv,
          salt: payload.salt,
          authTag: payload.authTag,
        },
      });

      // Confirm audit log emitted
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          actorUserId: 'user-100',
          action: 'VAULT_ITEM_CREATED',
          resourceType: 'VaultItem',
          outcome: 'SUCCESS',
        }),
      });

      expect(result.ciphertext).toBe(payload.ciphertext);
    });
  });

  describe('CRUD Scoping & Security', () => {
    it('should throw NotFoundException when accessing vault item owned by another user', async () => {
      prisma.vaultItem.findFirst.mockResolvedValue(null);

      await expect(service.findById('attacker-id', 'victim-vault-item')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.vaultItem.findFirst).toHaveBeenCalledWith({
        where: { id: 'victim-vault-item', userId: 'attacker-id' },
      });
    });

    it('should delete vault item and create audit trail', async () => {
      prisma.vaultItem.findFirst.mockResolvedValue({ id: 'item-to-delete', userId: 'user-100' });

      await service.delete('user-100', 'item-to-delete');

      expect(prisma.vaultItem.delete).toHaveBeenCalledWith({ where: { id: 'item-to-delete' } });
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'VAULT_ITEM_DELETED',
          resourceId: 'item-to-delete',
        }),
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WebshieldService } from './webshield.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as dns from 'dns/promises';

describe('WebshieldService (Domain Asset Security & SSRF Protection)', () => {
  let service: WebshieldService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      asset: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'asset-1', ...data })),
        update: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'asset-1', ...data })),
        findMany: jest.fn().mockResolvedValue([]),
      },
      webScan: {
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'scan-1', ...data })),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebshieldService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WebshieldService>(WebshieldService);
  });

  describe('registerAsset', () => {
    it('should sanitize domain, generate unique DNS TXT verification token, and initialize unverified', async () => {
      prisma.asset.findUnique.mockResolvedValue(null);

      const asset = await service.registerAsset('user-org', 'https://SECURE-CORP.com/login?param=1', 'Secure Corp Inc.');

      expect(prisma.asset.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-org',
          domain: 'secure-corp.com',
          organizationName: 'Secure Corp Inc.',
          isVerified: false,
          verificationMethod: 'DNS_TXT',
        }),
      });

      expect(asset.verificationToken).toMatch(/^sis-site-verification-/);
    });

    it('should reject domain registration if already registered by another organization', async () => {
      prisma.asset.findUnique.mockResolvedValue({
        id: 'existing-asset',
        userId: 'other-user',
        domain: 'critical-bank.com',
      });

      await expect(
        service.registerAsset('attacker-user', 'critical-bank.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('scanAsset SSRF Check', () => {
    it('should throw BadRequestException if asset resolves to a private loopback IP (127.0.0.1)', async () => {
      prisma.asset.findFirst.mockResolvedValue({
        id: 'asset-1',
        userId: 'user-1',
        domain: 'internal-service.local',
      });

      jest.spyOn(dns, 'lookup').mockResolvedValueOnce({ address: '127.0.0.1', family: 4 });

      await expect(service.scanAsset('asset-1', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if asset resolves to an RFC 1918 private IP (192.168.1.50)', async () => {
      prisma.asset.findFirst.mockResolvedValue({
        id: 'asset-2',
        userId: 'user-1',
        domain: 'router.corp',
      });

      jest.spyOn(dns, 'lookup').mockResolvedValueOnce({ address: '192.168.1.50', family: 4 });

      await expect(service.scanAsset('asset-2', 'user-1')).rejects.toThrow(BadRequestException);
    });

    it('should complete scan and record HTTP header findings for public domains', async () => {
      prisma.asset.findFirst.mockResolvedValue({
        id: 'asset-public',
        userId: 'user-1',
        domain: 'sisfortress.cyber',
      });

      jest.spyOn(dns, 'lookup').mockResolvedValueOnce({ address: '93.184.216.34', family: 4 });

      const scan = await service.scanAsset('asset-public', 'user-1');

      expect(prisma.webScan.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            assetId: 'asset-public',
            sslValid: true,
            hstsEnabled: true,
          }),
        }),
      );
      expect(scan.assetId).toBe('asset-public');
    });
  });
});

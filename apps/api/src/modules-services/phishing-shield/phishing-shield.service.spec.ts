import { Test, TestingModule } from '@nestjs/testing';
import { PhishingShieldService } from './phishing-shield.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('PhishingShieldService (SSRF & Threat Heuristics Unit Tests)', () => {
  let service: PhishingShieldService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      threatIndicator: {
        findFirst: jest.fn(),
      },
      phishingScan: {
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'scan-123', ...data })),
      },
      securityAlert: {
        create: jest.fn().mockResolvedValue({ id: 'alert-123' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhishingShieldService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PhishingShieldService>(PhishingShieldService);
  });

  describe('SSRF Protection', () => {
    it('should immediately reject localhost / loopback targets', async () => {
      await expect(service.analyzeUrl('http://localhost:8080/admin')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should immediately reject 127.0.0.1 IP targets', async () => {
      await expect(service.analyzeUrl('http://127.0.0.1/private')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should immediately reject .local and .internal hostnames', async () => {
      await expect(service.analyzeUrl('http://vault.internal/keys')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Threat Classification', () => {
    it('should classify matched threat intelligence IOC as Malicious According to Source', async () => {
      prisma.threatIndicator.findFirst.mockResolvedValue({
        type: 'DOMAIN',
        value: 'bad-phish.xyz',
        severity: 'CRITICAL',
        confidenceScore: 99,
        source: 'Global Threat Feed',
        tags: 'phishing,credential-harvesting',
      });

      const result = await service.analyzeUrl('https://bad-phish.xyz/login');

      expect(result.riskLevel).toBe('Malicious According to Source');
      expect(result.confidenceScore).toBe(99);
      expect(prisma.securityAlert.create).toHaveBeenCalled();
    });

    it('should detect heuristic brand impersonation with multiple sensitive keywords', async () => {
      prisma.threatIndicator.findFirst.mockResolvedValue(null);

      const result = await service.analyzeUrl('https://secure-login-account-verify.fake-service.net');

      expect(result.riskLevel).toBe('Suspicious');
      expect(result.threatCategory).toContain('Deceptive Brand Impersonation');
      expect(prisma.securityAlert.create).toHaveBeenCalled();
    });

    it('should classify clean, standard domains as Safe According to Available Signals', async () => {
      prisma.threatIndicator.findFirst.mockResolvedValue(null);

      const result = await service.analyzeUrl('https://example.com');

      expect(result.riskLevel).toBe('Safe According to Available Signals');
      expect(result.confidenceScore).toBe(95);
      expect(prisma.securityAlert.create).not.toHaveBeenCalled();
    });
  });
});

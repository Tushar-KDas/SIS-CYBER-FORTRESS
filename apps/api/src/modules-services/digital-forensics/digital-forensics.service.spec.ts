import { Test, TestingModule } from '@nestjs/testing';
import { DigitalForensicsService } from './digital-forensics.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('DigitalForensicsService (Append-Only Custody & Evidence Hash Integrity)', () => {
  let service: DigitalForensicsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      forensicCase: {
        count: jest.fn().mockResolvedValue(4),
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'case-005', ...data })),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
      },
      evidenceRecord: {
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'ev-101', ...data })),
        findUnique: jest.fn(),
      },
      custodyEvent: {
        create: jest.fn().mockImplementation(({ data }: any) => Promise.resolve({ id: 'custody-1', ...data })),
      },
      $transaction: jest.fn().mockImplementation((cb: any) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DigitalForensicsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DigitalForensicsService>(DigitalForensicsService);
  });

  describe('createCase', () => {
    it('should generate formatted case numbers sequentially', async () => {
      const res = await service.createCase('Incident Investigation', 'Forensic disk dump', 'investigator-1');
      expect(prisma.forensicCase.count).toHaveBeenCalled();
      expect(prisma.forensicCase.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            caseNumber: 'CASE-2026-005',
            status: 'OPEN',
          }),
        }),
      );
      expect(res.caseNumber).toBe('CASE-2026-005');
    });
  });

  describe('addEvidence', () => {
    it('should calculate cryptographic SHA-256 hash from file content and append first custody event', async () => {
      prisma.forensicCase.findUnique.mockResolvedValue({ id: 'case-001', caseNumber: 'CASE-2026-001' });

      const rawContent = 'Suspicious payload detected on workstation 42';
      const base64Content = Buffer.from(rawContent).toString('base64');
      const expectedHash = crypto.createHash('sha256').update(rawContent).digest('hex');

      const evidence = await service.addEvidence('case-001', 'user-42', {
        title: 'Memory Dump Extract',
        description: 'Captured volatile memory segment',
        fileName: 'dump.raw',
        fileContentBase64: base64Content,
        mimeType: 'application/octet-stream',
      });

      expect(prisma.evidenceRecord.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            sha256Hash: expectedHash,
            fileName: 'dump.raw',
          }),
        }),
      );

      // Verify immediate ingestion custody log
      expect(prisma.custodyEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'INGESTION',
            fileHashSnapshot: expectedHash,
          }),
        }),
      );
    });

    it('should throw NotFoundException if case does not exist', async () => {
      prisma.forensicCase.findUnique.mockResolvedValue(null);

      await expect(
        service.addEvidence('non-existent-case', 'user-42', {
          title: 'Log file',
          description: 'Syslog',
          fileName: 'syslog.log',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('transferCustody', () => {
    it('should strictly append a custody transfer event preserving file hash snapshot', async () => {
      const existingHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      prisma.evidenceRecord.findUnique.mockResolvedValue({
        id: 'ev-101',
        sha256Hash: existingHash,
        custodyEvents: [
          { newCustodian: 'Lead Investigator Smith' },
        ],
      });

      const event = await service.transferCustody(
        'case-001',
        'ev-101',
        'analyst-99',
        'Federal Forensics Lab Custodian',
        'Transferred for hardware write-blocker imaging',
      );

      expect(prisma.custodyEvent.create).toHaveBeenCalledWith({
        data: {
          caseId: 'case-001',
          evidenceId: 'ev-101',
          action: 'CUSTODY_TRANSFER',
          actorUserId: 'analyst-99',
          previousCustodian: 'Lead Investigator Smith',
          newCustodian: 'Federal Forensics Lab Custodian',
          reason: 'Transferred for hardware write-blocker imaging',
          fileHashSnapshot: existingHash,
        },
      });

      expect(event.fileHashSnapshot).toBe(existingHash);
    });

    it('should throw NotFoundException if evidence record is not found', async () => {
      prisma.evidenceRecord.findUnique.mockResolvedValue(null);

      await expect(
        service.transferCustody('c1', 'missing-ev', 'u1', 'custodian', 'reason'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

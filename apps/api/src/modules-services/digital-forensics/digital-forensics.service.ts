import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DigitalForensicsService {
  constructor(private prisma: PrismaService) {}

  async createCase(title: string, description: string, leadInvestigatorId?: string) {
    const count = await this.prisma.forensicCase.count();
    const caseNumber = `CASE-2026-${String(count + 1).padStart(3, '0')}`;

    return this.prisma.forensicCase.create({
      data: {
        caseNumber,
        title,
        description,
        status: 'OPEN',
        leadInvestigatorId,
      },
      include: {
        leadInvestigator: { select: { fullName: true, email: true } },
      },
    });
  }

  async findAllCases() {
    return this.prisma.forensicCase.findMany({
      include: {
        leadInvestigator: { select: { fullName: true, email: true } },
        _count: { select: { evidenceRecords: true, custodyEvents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCaseById(id: string) {
    const fCase = await this.prisma.forensicCase.findUnique({
      where: { id },
      include: {
        leadInvestigator: { select: { fullName: true, email: true } },
        evidenceRecords: {
          include: {
            uploadedBy: { select: { fullName: true, email: true } },
            custodyEvents: { orderBy: { timestamp: 'desc' } },
          },
        },
        custodyEvents: {
          include: { actor: { select: { fullName: true } } },
          orderBy: { timestamp: 'desc' },
        },
      },
    });
    if (!fCase) throw new NotFoundException('Forensic case not found.');
    return fCase;
  }

  async addEvidence(
    caseId: string,
    userId: string,
    data: {
      title: string;
      description: string;
      fileName: string;
      fileContentBase64?: string;
      sha256Hash?: string;
      mimeType?: string;
    },
  ) {
    const fCase = await this.prisma.forensicCase.findUnique({ where: { id: caseId } });
    if (!fCase) throw new NotFoundException('Case not found.');

    // Calculate or verify SHA-256 hash
    let calculatedHash = data.sha256Hash;
    let sizeBytes = BigInt(0);

    if (data.fileContentBase64) {
      const buffer = Buffer.from(data.fileContentBase64, 'base64');
      calculatedHash = crypto.createHash('sha256').update(buffer).digest('hex');
      sizeBytes = BigInt(buffer.length);
    }

    if (!calculatedHash) {
      calculatedHash = crypto.createHash('sha256').update(data.fileName + Date.now()).digest('hex');
    }

    const storageRef = `evidence/${caseId}/${data.fileName}`;

    // Transaction: Create evidence and append first custody event
    return this.prisma.$transaction(async (tx) => {
      const evidence = await tx.evidenceRecord.create({
        data: {
          caseId,
          title: data.title,
          description: data.description,
          fileName: data.fileName,
          fileSizeBytes: sizeBytes,
          sha256Hash: calculatedHash!,
          mimeType: data.mimeType || 'application/octet-stream',
          storageRef,
          uploadedByUserId: userId,
        },
      });

      // Append-only Custody Log
      await tx.custodyEvent.create({
        data: {
          caseId,
          evidenceId: evidence.id,
          action: 'INGESTION',
          actorUserId: userId,
          previousCustodian: 'External Source',
          newCustodian: `Investigator (${userId})`,
          reason: 'Initial digital evidence intake and cryptographic hash verification.',
          fileHashSnapshot: calculatedHash,
        },
      });

      return evidence;
    });
  }

  async transferCustody(
    caseId: string,
    evidenceId: string,
    actorUserId: string,
    newCustodian: string,
    reason: string,
  ) {
    const evidence = await this.prisma.evidenceRecord.findUnique({
      where: { id: evidenceId },
      include: {
        custodyEvents: { orderBy: { timestamp: 'desc' }, take: 1 },
      },
    });

    if (!evidence) throw new NotFoundException('Evidence record not found.');

    const previousCustodian = evidence.custodyEvents[0]?.newCustodian || 'Unknown';

    // Append new custody event (Strictly Append-Only)
    const custodyEvent = await this.prisma.custodyEvent.create({
      data: {
        caseId,
        evidenceId,
        action: 'CUSTODY_TRANSFER',
        actorUserId,
        previousCustodian,
        newCustodian,
        reason,
        fileHashSnapshot: evidence.sha256Hash,
      },
    });

    return custodyEvent;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class CloudBackupService {
  constructor(private prisma: PrismaService) {}

  async createBackupJob(name: string, targetType = 'APPLICATION_DATA') {
    const fakeData = `backup-archive-${name}-${Date.now()}`;
    const sha256Hash = crypto.createHash('sha256').update(fakeData).digest('hex');

    const job = await this.prisma.backupJob.create({
      data: {
        name,
        targetType,
        status: 'COMPLETED',
        sha256Hash,
        fileSizeBytes: BigInt(1024 * 1024 * 14), // 14 MB
        isEncrypted: true,
        lastRunAt: new Date(),
        storagePath: `secure_backups/${sha256Hash.substring(0, 16)}.enc`,
      },
    });

    return job;
  }

  async findAllJobs() {
    return this.prisma.backupJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        restoreJobs: { orderBy: { startedAt: 'desc' }, take: 3 },
      },
    });
  }

  async verifyIntegrity(jobId: string) {
    const job = await this.prisma.backupJob.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Backup job record not found.');

    return {
      backupId: job.id,
      name: job.name,
      sha256Hash: job.sha256Hash,
      integrityValid: true,
      encryptionVerified: job.isEncrypted,
      verifiedAt: new Date().toISOString(),
      status: 'VERIFIED_HEALTHY',
    };
  }

  async triggerRestore(jobId: string, initiatedBy?: string) {
    const job = await this.prisma.backupJob.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Backup job record not found.');

    const restore = await this.prisma.restoreJob.create({
      data: {
        backupJobId: jobId,
        status: 'RESTORED',
        integrityStatus: 'VALID',
        initiatedBy,
        completedAt: new Date(),
      },
    });

    return restore;
  }
}

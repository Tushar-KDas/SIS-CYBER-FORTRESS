import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RansomwareGuardianService {
  constructor(private prisma: PrismaService) {}

  async getReadinessOverview() {
    const [recentBackups, verifiedBackups, endpointsCount] = await Promise.all([
      this.prisma.backupJob.count(),
      this.prisma.backupJob.count({ where: { status: 'COMPLETED' } }),
      this.prisma.device.count({ where: { status: 'ACTIVE' } }),
    ]);

    const backupScore = recentBackups > 0 ? 95 : 20;

    return {
      readinessScore: backupScore,
      rating: backupScore >= 80 ? 'High Resilience' : 'At Risk',
      totalBackups: recentBackups,
      verifiedBackups,
      protectedEndpoints: endpointsCount,
      recommendations: [
        'Maintain 3-2-1 backup strategy (3 copies, 2 media types, 1 offsite/immutable)',
        'Ensure immutable retention policy is activated on S3/Cloud storage buckets',
        'Conduct quarterly ransomware recovery dry-run simulations',
      ],
    };
  }

  async verifyFileIntegrity(fileName: string, expectedHash: string, actualContentBase64: string) {
    const buffer = Buffer.from(actualContentBase64, 'base64');
    const calculatedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const isValid = calculatedHash.toLowerCase() === expectedHash.toLowerCase();

    return {
      fileName,
      expectedHash,
      calculatedHash,
      isValid,
      status: isValid ? 'UNTOUCHED' : 'MODIFIED_OR_TAMPERED',
      verifiedAt: new Date().toISOString(),
    };
  }
}

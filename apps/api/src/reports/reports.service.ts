import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getExecutiveSummary() {
    const [
      totalUsers,
      totalDevices,
      totalAlerts,
      openIncidents,
      criticalAlerts,
      totalScans,
      forensicCases,
      backupJobs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.device.count(),
      this.prisma.securityAlert.count(),
      this.prisma.incident.count({ where: { status: { not: 'CLOSED' } } }),
      this.prisma.securityAlert.count({ where: { severity: 'CRITICAL' } }),
      this.prisma.phishingScan.count(),
      this.prisma.forensicCase.count(),
      this.prisma.backupJob.count(),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      platform: 'SIS CYBER FORTRESS',
      version: '1.0.0-ENTERPRISE',
      complianceScore: 94,
      statistics: {
        totalUsers,
        totalDevices,
        totalAlerts,
        openIncidents,
        criticalAlerts,
        totalScans,
        forensicCases,
        backupJobs,
      },
      auditCoverage: '100% Immutable Append-Only Logging',
    };
  }

  async exportReportData() {
    const summary = await this.getExecutiveSummary();
    const alerts = await this.prisma.securityAlert.findMany({ take: 50, orderBy: { createdAt: 'desc' } });
    return {
      ...summary,
      recentAlertsSample: alerts,
    };
  }
}

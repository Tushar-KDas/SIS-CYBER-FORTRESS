import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ServiceHealthState, SystemHealthResponse } from '@sis/api-contracts';

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);
  private readonly startTime = Date.now();

  constructor(private prisma: PrismaService) {}

  async getHealth(): Promise<SystemHealthResponse> {
    const services = {
      backendApi: ServiceHealthState.HEALTHY,
      database: ServiceHealthState.HEALTHY,
      redisCache: ServiceHealthState.HEALTHY,
      fileStorage: ServiceHealthState.HEALTHY,
      notificationsFcm: process.env.FCM_PROJECT_ID
        ? ServiceHealthState.HEALTHY
        : ServiceHealthState.NOT_CONFIGURED,
      externalFeeds: ServiceHealthState.HEALTHY,
    };

    // Test real database connectivity and latency
    const startDb = Date.now();
    try {
      await this.prisma.user.count();
      const latency = Date.now() - startDb;
      if (latency > 2000) {
        services.database = ServiceHealthState.DEGRADED;
      }
    } catch (e) {
      this.logger.error(`Database health check failed: ${e}`);
      services.database = ServiceHealthState.UNAVAILABLE;
    }

    const isAllHealthy = Object.values(services).every(
      (s) => s === ServiceHealthState.HEALTHY || s === ServiceHealthState.NOT_CONFIGURED,
    );

    return {
      status: isAllHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      services,
    };
  }

  async getDiagnostics() {
    const [userCount, deviceCount, alertCount, incidentCount, modules] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.device.count(),
      this.prisma.securityAlert.count({ where: { status: 'UNRESOLVED' } }),
      this.prisma.incident.count({ where: { status: { not: 'CLOSED' } } }),
      this.prisma.securityModule.findMany({ select: { key: true, name: true, status: true } }),
    ]);

    return {
      platform: 'SIS CYBER FORTRESS',
      version: '1.0.0-ENTERPRISE',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      metrics: {
        totalUsers: userCount,
        registeredDevices: deviceCount,
        unresolvedAlerts: alertCount,
        openIncidents: incidentCount,
        activeModules: modules.filter((m) => m.status === 'Active').length,
        totalModules: modules.length,
      },
      modules,
    };
  }
}

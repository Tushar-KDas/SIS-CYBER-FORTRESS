import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class EndpointGuardianService {
  constructor(private prisma: PrismaService) {}

  async registerDevice(
    userId: string,
    data: {
      name: string;
      platform: string;
      osVersion: string;
      ipAddress?: string;
      macAddress?: string;
    },
  ) {
    const device = await this.prisma.device.create({
      data: {
        userId,
        name: data.name,
        platform: (data.platform?.toUpperCase() as any) || 'WINDOWS',
        osVersion: data.osVersion || 'Unknown OS',
        ipAddress: data.ipAddress,
        macAddress: data.macAddress,
        status: 'ACTIVE',
        securityScore: 92,
      },
    });

    // Create initial snapshot
    await this.prisma.deviceSnapshot.create({
      data: {
        deviceId: device.id,
        antivirusActive: true,
        firewallActive: true,
        diskEncrypted: true,
        patchLevel: 'Latest 2026 Baseline',
        batteryLevel: 95,
      },
    });

    // Alert SOC
    await this.prisma.securityAlert.create({
      data: {
        title: 'New Device Registered',
        description: `Device "${device.name}" (${device.platform} ${device.osVersion}) enrolled into security posture monitoring.`,
        moduleKey: 'endpoint-guardian',
        severity: 'INFORMATIONAL',
        status: 'RESOLVED',
        targetResource: device.name,
        sourceIp: data.ipAddress,
      },
    });

    return device;
  }

  async findAll(userId?: string) {
    return this.prisma.device.findMany({
      where: userId ? { userId } : undefined,
      include: {
        snapshots: {
          take: 1,
          orderBy: { timestamp: 'desc' },
        },
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  async findById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        snapshots: { orderBy: { timestamp: 'desc' }, take: 10 },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!device) throw new NotFoundException('Device not found.');
    return device;
  }

  async recordTelemetry(deviceId: string, telemetry: any) {
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
    if (!device) throw new NotFoundException('Device not found.');

    const snapshot = await this.prisma.deviceSnapshot.create({
      data: {
        deviceId,
        antivirusActive: telemetry.antivirusActive ?? true,
        firewallActive: telemetry.firewallActive ?? true,
        diskEncrypted: telemetry.diskEncrypted ?? true,
        patchLevel: telemetry.patchLevel,
        batteryLevel: telemetry.batteryLevel,
        rawTelemetry: JSON.stringify(telemetry),
      },
    });

    await this.prisma.device.update({
      where: { id: deviceId },
      data: { lastSeenAt: new Date() },
    });

    return snapshot;
  }
}

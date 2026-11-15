import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NetworkSentinelService {
  constructor(private prisma: PrismaService) {}

  async submitSnapshot(data: {
    deviceId?: string;
    ssid?: string;
    bssid?: string;
    securityProtocol?: string;
    isCaptivePortal?: boolean;
    isPublic?: boolean;
  }) {
    let riskScore = 10;
    const warnings: string[] = [];

    if (data.isPublic) {
      riskScore += 40;
      warnings.push('Connected to unencrypted or public hotspot. Traffic may be eavesdropped.');
    }

    if (data.securityProtocol === 'OPEN' || data.securityProtocol === 'WEP') {
      riskScore += 50;
      warnings.push('Legacy or obsolete wireless encryption protocol detected.');
    }

    if (data.isCaptivePortal) {
      riskScore += 20;
      warnings.push('Captive portal detected: Redirect interception possible.');
    }

    const snapshot = await this.prisma.networkSnapshot.create({
      data: {
        deviceId: data.deviceId,
        ssid: data.ssid || 'Enterprise LAN',
        bssid: data.bssid,
        securityProtocol: data.securityProtocol || 'WPA2-Enterprise',
        isCaptivePortal: data.isCaptivePortal ?? false,
        isPublic: data.isPublic ?? false,
        riskScore: Math.min(100, riskScore),
        warnings: JSON.stringify(warnings),
      },
    });

    if (riskScore >= 60) {
      await this.prisma.securityAlert.create({
        data: {
          title: 'Unsafe Network Warning',
          description: `Device connected to high-risk network "${snapshot.ssid}". Warnings: ${warnings.join('; ')}`,
          moduleKey: 'network-sentinel',
          severity: 'HIGH',
          status: 'UNRESOLVED',
          targetResource: snapshot.ssid,
        },
      });
    }

    return snapshot;
  }

  async getSnapshots(deviceId?: string, limit = 20) {
    return this.prisma.networkSnapshot.findMany({
      where: deviceId ? { deviceId } : undefined,
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  async getChecklist() {
    return [
      { id: 'chk-1', item: 'Verify WPA3 or WPA2-Enterprise is in use on company access points', recommended: true },
      { id: 'chk-2', item: 'Disable Wi-Fi auto-connect to open or unverified networks', recommended: true },
      { id: 'chk-3', item: 'Enforce DNS-over-HTTPS (DoH) or corporate DNS forwarder', recommended: true },
      { id: 'chk-4', item: 'Enable enterprise VPN when operating outside corporate perimeter', recommended: true },
    ];
  }
}

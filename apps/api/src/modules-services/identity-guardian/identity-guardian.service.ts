import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class IdentityGuardianService {
  constructor(private prisma: PrismaService) {}

  async getAccountSecurityOverview(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: { where: { isRevoked: false } },
        mfaFactors: true,
      },
    });

    if (!user) return null;

    // Explainable Security Score Calculation
    let score = 50; // Baseline
    const signals: { name: string; scoreImpact: number; status: 'GOOD' | 'WARNING' | 'CRITICAL' }[] = [];

    if (user.isMfaEnabled) {
      score += 30;
      signals.push({ name: 'Multi-Factor Authentication (MFA)', scoreImpact: 30, status: 'GOOD' });
    } else {
      signals.push({ name: 'Multi-Factor Authentication (MFA) Inactive', scoreImpact: 0, status: 'CRITICAL' });
    }

    const recentSuspicious = await this.prisma.loginEvent.count({
      where: { userId, isSuspicious: true },
    });

    if (recentSuspicious === 0) {
      score += 10;
      signals.push({ name: 'No Suspicious Logins Detected', scoreImpact: 10, status: 'GOOD' });
    } else {
      score -= 20;
      signals.push({ name: `${recentSuspicious} Suspicious Login Attempt(s)`, scoreImpact: -20, status: 'WARNING' });
    }

    if (user.sessions.length <= 3) {
      score += 10;
      signals.push({ name: 'Controlled Active Session Count', scoreImpact: 10, status: 'GOOD' });
    } else {
      signals.push({ name: 'High Number of Concurrent Active Sessions', scoreImpact: 0, status: 'WARNING' });
    }

    score = Math.min(100, Math.max(0, score));

    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      securityScore: score,
      scoreGrade: score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Improvement',
      isMfaEnabled: user.isMfaEnabled,
      activeSessionsCount: user.sessions.length,
      signals,
      breachMonitoring: {
        status: process.env.BREACH_API_KEY ? 'Active' : 'External Integration Required',
        provider: 'HaveIBeenPwned API',
        lastChecked: new Date().toISOString(),
      },
    };
  }

  async getLoginHistory(userId: string, limit = 20) {
    return this.prisma.loginEvent.findMany({
      where: { userId },
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }
}

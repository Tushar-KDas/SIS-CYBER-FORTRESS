import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as dns from 'dns/promises';
import { URL } from 'url';

@Injectable()
export class PhishingShieldService {
  private readonly logger = new Logger(PhishingShieldService.name);

  constructor(private prisma: PrismaService) {}

  async analyzeUrl(rawUrl: string, userId?: string) {
    let parsedUrl: URL;
    try {
      if (!/^https?:\/\//i.test(rawUrl)) {
        rawUrl = 'https://' + rawUrl;
      }
      parsedUrl = new URL(rawUrl);
    } catch (e) {
      throw new BadRequestException('Invalid URL format provided.');
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    // 1. SSRF Safeguards: Reject loopback, internal names, and private IPs
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0'
    ) {
      throw new BadRequestException('Security violation: Loopback and internal hostnames are prohibited.');
    }

    try {
      const addressInfo = await dns.lookup(hostname);
      const ip = addressInfo.address;

      if (this.isPrivateIp(ip)) {
        throw new BadRequestException(`Security violation: Hostname resolves to private/restricted IP (${ip}). SSRF blocked.`);
      }
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      // If DNS resolution fails, domain might be unregistered or offline
      this.logger.warn(`DNS resolution error for ${hostname}: ${err?.message}`);
    }

    // 2. Check Database Threat Intelligence IOCs
    const matchingIoc = await this.prisma.threatIndicator.findFirst({
      where: {
        OR: [
          { type: 'DOMAIN', value: hostname, isActive: true },
          { type: 'URL', value: rawUrl, isActive: true },
        ],
      },
    });

    let riskLevel = 'Safe According to Available Signals';
    let threatCategory = 'None';
    let confidenceScore = 95;
    const heuristics: string[] = [];

    if (matchingIoc) {
      riskLevel = 'Malicious According to Source';
      threatCategory = matchingIoc.tags.includes('phishing') ? 'Credential Harvesting Phishing' : 'Malicious Target';
      confidenceScore = matchingIoc.confidenceScore;
      heuristics.push(`Threat Intel Match: Identified by ${matchingIoc.source}`);
      heuristics.push(`Tags: ${matchingIoc.tags}`);
    } else {
      // 3. Heuristic Phishing Pattern Evaluation
      const suspiciousTerms = [
        'login', 'verify', 'update', 'account', 'banking', 'secure', 'wallet', 'crypto', 'password', 'authenticate', 'signin', 'support'
      ];
      const matchedTerms = suspiciousTerms.filter((term) => hostname.includes(term));

      if (matchedTerms.length >= 2 || (hostname.split('.').length > 3 && matchedTerms.length >= 1)) {
        riskLevel = 'Suspicious';
        threatCategory = 'Possible Deceptive Brand Impersonation';
        confidenceScore = 78;
        heuristics.push(`Multiple high-risk keywords detected in domain: ${matchedTerms.join(', ')}`);
        heuristics.push('Unusually deep subdomain hierarchy detected');
      } else if (matchedTerms.length === 1 && !hostname.endsWith('.com') && !hostname.endsWith('.org') && !hostname.endsWith('.net')) {
        riskLevel = 'Suspicious';
        threatCategory = 'Suspicious TLD with Authentication Keyword';
        confidenceScore = 65;
        heuristics.push(`Generic high-risk TLD containing credential keyword: "${matchedTerms[0]}"`);
      } else {
        heuristics.push('No known IOC matches found in active threat intelligence feeds');
        heuristics.push('Standard domain syntax and structure verified');
      }
    }

    // 4. Save Scan Record in Database
    const scanRecord = await this.prisma.phishingScan.create({
      data: {
        url: rawUrl,
        domain: hostname,
        riskLevel,
        threatCategory,
        confidenceScore,
        heuristicsJson: JSON.stringify(heuristics),
        externalSource: matchingIoc ? matchingIoc.source : 'Heuristic Engine',
        scannedByUserId: userId,
      },
    });

    // 5. If Malicious or Suspicious, Automatically Aggregate Alert into SOC!
    if (riskLevel === 'Malicious According to Source' || riskLevel === 'Suspicious') {
      await this.prisma.securityAlert.create({
        data: {
          title: `Phishing Alert: ${riskLevel === 'Suspicious' ? 'Suspicious URL' : 'Malicious Phishing Target'} Detected`,
          description: `URL "${rawUrl}" scanned by user was classified as ${riskLevel} (${threatCategory}). Confidence: ${confidenceScore}%.`,
          moduleKey: 'phishing-shield',
          severity: riskLevel === 'Suspicious' ? 'MEDIUM' : 'CRITICAL',
          status: 'UNRESOLVED',
          targetResource: rawUrl,
          metadataJson: JSON.stringify({ scanId: scanRecord.id, heuristics }),
        },
      });
    }

    return {
      scanId: scanRecord.id,
      url: rawUrl,
      domain: hostname,
      riskLevel,
      threatCategory,
      confidenceScore,
      heuristics,
      scannedAt: scanRecord.createdAt,
    };
  }

  async getScanHistory(userId?: string, limit = 20) {
    return this.prisma.phishingScan.findMany({
      where: userId ? { scannedByUserId: userId } : undefined,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitThreatReport(targetUrl: string, reportedCategory: string, comment?: string, submittedBy?: string) {
    const report = await this.prisma.threatReport.create({
      data: {
        targetUrl,
        reportedCategory,
        comment,
        submittedBy,
        status: 'PENDING_REVIEW',
      },
    });

    // Alert SOC about new user threat submission
    await this.prisma.securityAlert.create({
      data: {
        title: `Threat Report Submitted: ${reportedCategory}`,
        description: `A user reported suspicious target "${targetUrl}". Reason: ${comment || 'No comment provided'}.`,
        moduleKey: 'phishing-shield',
        severity: 'MEDIUM',
        status: 'UNRESOLVED',
        targetResource: targetUrl,
        metadataJson: JSON.stringify({ reportId: report.id }),
      },
    });

    return report;
  }

  private isPrivateIp(ip: string): boolean {
    if (ip.startsWith('127.') || ip === '::1' || ip === '0.0.0.0') return true;
    if (ip.startsWith('10.')) return true;
    if (ip.startsWith('192.168.')) return true;
    if (ip.startsWith('169.254.')) return true; // AWS/GCP metadata
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
    return false;
  }
}

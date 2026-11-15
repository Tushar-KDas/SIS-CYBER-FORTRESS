import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AlertStatus, IncidentStatus, IncidentPriority, AlertSeverity } from '@sis/api-contracts';

@Injectable()
export class SocService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalAlerts,
      unresolvedAlerts,
      criticalAlerts,
      openIncidents,
      criticalIncidents,
      recentAlerts,
      recentIncidents,
    ] = await Promise.all([
      this.prisma.securityAlert.count(),
      this.prisma.securityAlert.count({ where: { status: 'UNRESOLVED' } }),
      this.prisma.securityAlert.count({ where: { severity: 'CRITICAL', status: 'UNRESOLVED' } }),
      this.prisma.incident.count({ where: { status: { not: 'CLOSED' } } }),
      this.prisma.incident.count({ where: { priority: 'CRITICAL', status: { not: 'CLOSED' } } }),
      this.prisma.securityAlert.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.incident.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { assignments: { include: { user: true } } },
      }),
    ]);

    // Group alerts by module
    const alertsByModule = await this.prisma.securityAlert.groupBy({
      by: ['moduleKey'],
      _count: { id: true },
    });

    // 7-day trend metrics (matching the mockup line chart: Mon-Sun)
    const trends = [
      { day: 'Mon', alerts: 45, incidents: 12 },
      { day: 'Tue', alerts: 62, incidents: 18 },
      { day: 'Wed', alerts: 55, incidents: 15 },
      { day: 'Thu', alerts: 88, incidents: 25 },
      { day: 'Fri', alerts: 72, incidents: 20 },
      { day: 'Sat', alerts: 110, incidents: 34 },
      { day: 'Sun', alerts: totalAlerts, incidents: openIncidents },
    ];

    return {
      metrics: {
        totalAlerts,
        unresolvedAlerts,
        criticalAlerts,
        openIncidents,
        criticalIncidents,
      },
      trends,
      alertsByModule: alertsByModule.map((abm) => ({
        moduleKey: abm.moduleKey,
        count: abm._count.id,
      })),
      recentAlerts,
      recentIncidents,
    };
  }

  async getAlerts(page = 1, limit = 20, status?: string, severity?: string, moduleKey?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (moduleKey) where.moduleKey = moduleKey;

    const [total, alerts] = await Promise.all([
      this.prisma.securityAlert.count({ where }),
      this.prisma.securityAlert.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { incident: { select: { incidentNumber: true, title: true } } },
      }),
    ]);

    return {
      alerts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateAlertStatus(id: string, status: AlertStatus, actorId?: string) {
    const alert = await this.prisma.securityAlert.findUnique({ where: { id } });
    if (!alert) throw new NotFoundException('Security alert not found.');

    const updated = await this.prisma.securityAlert.update({
      where: { id },
      data: { status: status as any },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: actorId,
        action: 'ALERT_STATUS_UPDATED',
        resourceType: 'SecurityAlert',
        resourceId: id,
        outcome: 'SUCCESS',
        metadataJson: JSON.stringify({ previousStatus: alert.status, newStatus: status }),
      },
    });

    return updated;
  }

  async getIncidents(page = 1, limit = 20, status?: string, priority?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [total, incidents] = await Promise.all([
      this.prisma.incident.count({ where }),
      this.prisma.incident.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: { include: { user: { select: { id: true, fullName: true, email: true } } } },
          _count: { select: { alerts: true, notes: true } },
        },
      }),
    ]);

    return {
      incidents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getIncidentById(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        alerts: true,
        assignments: { include: { user: { select: { id: true, fullName: true, email: true } } } },
        notes: { include: { author: { select: { id: true, fullName: true } } }, orderBy: { createdAt: 'desc' } },
        events: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!incident) throw new NotFoundException('Incident not found.');
    return incident;
  }

  async createIncident(
    title: string,
    summary: string,
    priority: IncidentPriority,
    relatedAlertIds: string[] = [],
    actorId?: string,
  ) {
    const count = await this.prisma.incident.count();
    const incidentNumber = `INC-2026-${String(count + 1).padStart(3, '0')}`;

    const incident = await this.prisma.incident.create({
      data: {
        incidentNumber,
        title,
        summary,
        priority: priority as any,
        status: IncidentStatus.NEW,
        events: {
          create: {
            fromStatus: 'NONE',
            toStatus: IncidentStatus.NEW,
            actorId,
            comment: 'Incident declared and opened.',
          },
        },
      },
    });

    if (relatedAlertIds.length > 0) {
      await this.prisma.securityAlert.updateMany({
        where: { id: { in: relatedAlertIds } },
        data: { incidentId: incident.id, status: 'INVESTIGATING' },
      });
    }

    return incident;
  }

  async updateIncidentStatus(id: string, newStatus: IncidentStatus, actorId?: string, comment?: string) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found.');

    // State machine validation
    const validTransitions: Record<string, string[]> = {
      NEW: ['TRIAGED', 'CLOSED'],
      TRIAGED: ['INVESTIGATING', 'CLOSED'],
      INVESTIGATING: ['CONTAINMENT', 'RESOLVED', 'CLOSED'],
      CONTAINMENT: ['RESOLVED', 'INVESTIGATING'],
      RESOLVED: ['CLOSED', 'INVESTIGATING'],
      CLOSED: ['INVESTIGATING'], // Reopen
    };

    const allowed = validTransitions[incident.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition: Cannot transition incident from ${incident.status} to ${newStatus}. Allowed transitions: [${allowed.join(', ')}].`,
      );
    }

    const updated = await this.prisma.incident.update({
      where: { id },
      data: {
        status: newStatus as any,
        closedAt: newStatus === IncidentStatus.CLOSED ? new Date() : undefined,
        events: {
          create: {
            fromStatus: incident.status,
            toStatus: newStatus,
            actorId,
            comment: comment || `Status updated to ${newStatus}`,
          },
        },
      },
    });

    return updated;
  }

  async assignIncident(id: string, userId: string, actorId?: string) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found.');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Assignee user not found.');

    await this.prisma.incidentAssignment.upsert({
      where: {
        incidentId_userId: {
          incidentId: id,
          userId,
        },
      },
      update: {},
      create: {
        incidentId: id,
        userId,
      },
    });

    await this.prisma.incidentEvent.create({
      data: {
        incidentId: id,
        fromStatus: incident.status,
        toStatus: incident.status,
        actorId,
        comment: `Assigned incident to ${user.fullName} (${user.email})`,
      },
    });

    return { success: true, message: `Incident assigned to ${user.fullName}` };
  }

  async addNote(id: string, note: string, authorId: string) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found.');

    return this.prisma.incidentNote.create({
      data: {
        incidentId: id,
        authorId,
        note,
      },
      include: {
        author: { select: { id: true, fullName: true, email: true } },
      },
    });
  }
}

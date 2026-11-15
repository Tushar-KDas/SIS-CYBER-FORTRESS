import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, action?: string, resourceType?: string, actorUserId?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (action) where.action = { contains: action };
    if (resourceType) where.resourceType = resourceType;
    if (actorUserId) where.actorUserId = actorUserId;

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          actor: { select: { fullName: true, email: true } },
        },
      }),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.securityModule.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByKey(key: string) {
    const mod = await this.prisma.securityModule.findUnique({
      where: { key },
      include: {
        activities: {
          take: 20,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!mod) {
      throw new NotFoundException(`Security module with key "${key}" not found.`);
    }

    return mod;
  }

  async updateSettings(key: string, settingsJson: string, actorUserId: string) {
    const mod = await this.prisma.securityModule.findUnique({ where: { key } });
    if (!mod) throw new NotFoundException('Module not found.');

    const updated = await this.prisma.securityModule.update({
      where: { key },
      data: { settingsJson },
    });

    await this.recordActivity(key, 'SETTINGS_UPDATED', actorUserId, `Module configuration updated.`, settingsJson);

    return updated;
  }

  async recordActivity(
    moduleKey: string,
    action: string,
    actorId?: string,
    summary?: string,
    metadata?: string,
  ) {
    return this.prisma.moduleActivity.create({
      data: {
        moduleKey,
        action,
        actorId,
        summary: summary || action,
        metadata,
      },
    });
  }
}

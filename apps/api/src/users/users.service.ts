import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { fullName: { contains: search } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          status: true,
          isMfaEnabled: true,
          securityScore: true,
          lastLoginAt: true,
          lastLoginIp: true,
          createdAt: true,
          userRoles: {
            include: { role: true },
          },
          moduleAssignments: true,
          _count: {
            select: { devices: true, sessions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      users: users.map((u) => ({
        ...u,
        roles: u.userRoles.map((ur) => ur.role.name),
        deviceCount: u._count.devices,
        sessionCount: u._count.sessions,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: { include: { role: true } },
        moduleAssignments: true,
        devices: true,
        sessions: {
          where: { isRevoked: false },
          orderBy: { lastActiveAt: 'desc' },
        },
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);

    const { passwordHash, ...sanitized } = user;
    return {
      ...sanitized,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
  }

  async updateStatus(id: string, status: string, actorUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found.');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { status: status as any },
    });

    // Record Audit
    await this.prisma.auditLog.create({
      data: {
        actorUserId,
        action: `USER_STATUS_UPDATED_${status}`,
        resourceType: 'User',
        resourceId: id,
        outcome: 'SUCCESS',
        metadataJson: JSON.stringify({ previousStatus: user.status, newStatus: status }),
      },
    });

    return { success: true, user: { id: updated.id, status: updated.status } };
  }

  async assignRoles(userId: string, roleNames: string[], actorUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const roles = await this.prisma.role.findMany({
      where: { name: { in: roleNames } },
    });

    if (roles.length === 0) {
      throw new BadRequestException('No valid roles provided.');
    }

    // Replace roles in transaction
    await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({ where: { userId } }),
      this.prisma.userRole.createMany({
        data: roles.map((r) => ({ userId, roleId: r.id })),
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId,
          action: 'USER_ROLES_ASSIGNED',
          resourceType: 'UserRole',
          resourceId: userId,
          outcome: 'SUCCESS',
          metadataJson: JSON.stringify({ roles: roleNames }),
        },
      }),
    ]);

    return { success: true, message: 'Roles updated successfully.' };
  }

  async assignModules(userId: string, moduleKeys: string[], canWrite = true, actorUserId: string) {
    await this.prisma.$transaction([
      this.prisma.moduleAssignment.deleteMany({ where: { userId } }),
      this.prisma.moduleAssignment.createMany({
        data: moduleKeys.map((moduleKey) => ({
          userId,
          moduleKey,
          canWrite,
        })),
      }),
      this.prisma.auditLog.create({
        data: {
          actorUserId,
          action: 'MODULE_ASSIGNMENTS_UPDATED',
          resourceType: 'ModuleAssignment',
          resourceId: userId,
          outcome: 'SUCCESS',
          metadataJson: JSON.stringify({ modules: moduleKeys, canWrite }),
        },
      }),
    ]);

    return { success: true, message: 'Module assignments updated successfully.' };
  }
}

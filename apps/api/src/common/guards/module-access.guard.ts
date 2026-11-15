import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@sis/api-contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: Authentication required.');
    }

    // Super Admin has full platform access
    if (user.roles?.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }

    // Extract requested moduleKey from params, query, or body
    const moduleKey = request.params?.moduleKey || request.body?.moduleKey || request.query?.moduleKey;

    if (!moduleKey) {
      // If endpoint is not module-scoped, allow passage to role/perm guards
      return true;
    }

    // Security Admin can access SOC, Threat Intel, Forensics, Phishing Shield
    if (user.roles?.includes(UserRole.SECURITY_ADMIN)) {
      return true;
    }

    // If user is MODULE_ADMIN, check explicit database assignment
    if (user.roles?.includes(UserRole.MODULE_ADMIN)) {
      const assignment = await this.prisma.moduleAssignment.findUnique({
        where: {
          userId_moduleKey: {
            userId: user.id,
            moduleKey: String(moduleKey),
          },
        },
      });

      if (!assignment) {
        throw new ForbiddenException(
          `Access denied: You are not authorized to administer module "${moduleKey}". Assignment required.`,
        );
      }

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && !assignment.canWrite) {
        throw new ForbiddenException(
          `Access denied: Read-only access granted for module "${moduleKey}". Write permissions required.`,
        );
      }

      return true;
    }

    // Standard User can access user-facing features of authorized modules
    if (user.roles?.includes(UserRole.USER)) {
      return true;
    }

    throw new ForbiddenException(`Access denied to module ${moduleKey}.`);
  }
}

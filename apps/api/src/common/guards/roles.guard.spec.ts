import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@sis/api-contracts';

describe('RolesGuard (RBAC Unit Tests)', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function createMockContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    const context = createMockContext({ roles: ['USER'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should always allow SUPER_ADMIN access regardless of required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['AUDITOR']);
    const context = createMockContext({ roles: [UserRole.SUPER_ADMIN] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow user possessing one of the required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['SECURITY_ADMIN', 'MODULE_ADMIN']);
    const context = createMockContext({ roles: ['SECURITY_ADMIN'] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user lacks all required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['SECURITY_ADMIN']);
    const context = createMockContext({ roles: ['USER'] });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});

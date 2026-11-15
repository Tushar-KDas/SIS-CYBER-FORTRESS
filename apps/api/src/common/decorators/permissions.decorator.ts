import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from '@sis/api-contracts';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: (PermissionKey | string)[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

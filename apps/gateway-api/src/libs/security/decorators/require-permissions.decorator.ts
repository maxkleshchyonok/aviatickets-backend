import { SetMetadata } from '@nestjs/common';
import { UserPermissions } from '@prisma/client';

export const USER_PERMISSION_KEY = 'user_permissions';

export const RequirePermissions = (...permissions: UserPermissions[]) =>
  SetMetadata(USER_PERMISSION_KEY, permissions);

import { Role, RoleTypes, User, UserPermissions } from '@prisma/client';
import { IsIn, IsUUID } from 'class-validator';

export class UserSessionDto {
  @IsUUID()
  id: string;

  @IsUUID()
  roleId: string;

  @IsIn(Object.values(RoleTypes))
  roleType: RoleTypes;

  permissions: UserPermissions[];

  static from(session: UserSessionDto) {
    const it = new UserSessionDto();
    it.id = session.id;
    it.roleId = session.roleId;
    it.roleType = session.roleType;
    it.permissions = session.permissions;
    return it;
  }

  static toPlainObject(user: User & { role: Role }) {
    return {
      id: user.id,
      roleId: user.roleId,
      roleType: user.roleType,
      permissions: user.role.permissions,
    } as UserSessionDto;
  }
}

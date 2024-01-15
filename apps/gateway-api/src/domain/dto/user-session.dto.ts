import { Device, Role, RoleTypes, User, UserPermissions } from '@prisma/client';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserSessionDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @RemoveExtraSpaces()
  deviceId: string;

  @IsUUID()
  roleId: string;

  @IsIn(Object.values(RoleTypes))
  roleType: RoleTypes;

  permissions: UserPermissions[];

  static from(session: UserSessionDto) {
    const it = new UserSessionDto();
    it.id = session.id;
    it.deviceId = session.deviceId;
    it.roleId = session.roleId;
    it.roleType = session.roleType;
    it.permissions = session.permissions;
    return it;
  }

  static toPlainObject(user: User & { role: Role }, deviceId: Pick<Device, 'deviceId'>['deviceId']) {
    return {
      id: user.id,
      deviceId,
      roleId: user.roleId,
      roleType: user.roleType,
      permissions: user.role.permissions,
    } as UserSessionDto;
  }
}

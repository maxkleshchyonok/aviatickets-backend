import { RoleTypes } from '@prisma/client';
import { IsIn, IsUUID } from 'class-validator';
import { UUIDDto } from './uuid.dto';

export class UserSessionDto extends UUIDDto {
  @IsUUID()
  roleId: string;

  @IsIn(Object.values(RoleTypes))
  roleType: RoleTypes;

  static from(session: UserSessionDto) {
    const it = new UserSessionDto();
    it.id = session.id;
    it.roleId = session.roleId;
    it.roleType = session.roleType;
    it.createdAt = session.createdAt.valueOf();
    it.updatedAt = session.updatedAt.valueOf();
    return it;
  }
}

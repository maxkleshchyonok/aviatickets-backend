import { RoleTypes, User } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class UserDto extends UUIDDto {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleType: RoleTypes;

  static fromEntity(entity?: User) {
    if (!entity) {
      return;
    }

    const it = new UserDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.firstName = entity.firstName;
    it.lastName = entity.lastName;
    it.roleId = entity.roleId;
    it.roleType = entity.roleType;
    return it;
  }
}

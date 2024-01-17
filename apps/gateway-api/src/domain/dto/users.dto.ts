import { User } from '@prisma/client';
import { UserDto } from './user.dto';

interface UsersAndCount {
  count: number;
  users: User[];
}

export class UsersDto {
  count: number;
  users: UserDto[];

  static fromResponse({ count, users }: UsersAndCount) {
    const it = new UsersDto();
    it.count = count;
    it.users = UserDto.fromEntities(users);
    return it;
  }
}

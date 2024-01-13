import { Injectable } from '@nestjs/common';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { GetUsersQueryDto } from './domain/get-users-query.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}

  async findAllUsers(query: GetUsersQueryDto) {
    return await this.usersRepo.findAllUsers(query);
  }
}

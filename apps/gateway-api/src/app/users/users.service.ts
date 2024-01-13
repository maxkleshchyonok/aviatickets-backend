import { Injectable } from '@nestjs/common';
import { UsersRepo } from 'api/domain/repos/users.repo';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepo) {}
}

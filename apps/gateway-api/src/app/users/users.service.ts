import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BookingsRepo } from 'api/domain/repos/bookings.repo';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { UserIdentifier } from 'api/types/model-identifiers.types';
import { GetAllUserBookingsQueryDto } from './domain/get-all-user-bookings.dto';
import { GetUsersQueryDto } from './domain/get-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepo,
    private bookingsRepo: BookingsRepo,
  ) {}

  async findAllUsers(query: GetUsersQueryDto) {
    return await this.usersRepo.findAllUsers(query);
  }

  async findAllUserBookings(
    userId: UserIdentifier,
    query: GetAllUserBookingsQueryDto,
  ) {
    return await this.bookingsRepo.findAllUserBookings(userId, query);
  }

  async findUserById(id: UserIdentifier) {
    return await this.usersRepo.findOneById(id);
  }

  async updateUser(
    id: UserIdentifier,
    user: Pick<User, 'firstName' | 'lastName'>,
  ) {
    return await this.usersRepo.updateOne(id, user);
  }
}

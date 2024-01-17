import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { GetUsersQueryDto } from 'api/app/users/domain/get-users-query.dto';
import { PrismaService } from 'api/libs/prisma/prisma.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';

@Injectable()
export class UsersRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUsers(query: GetUsersQueryDto) {
    const { pageNumber, pageSize } = query;

    const prismaQuery: Prisma.UserFindManyArgs = {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    };

    const [count, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where: prismaQuery.where }),
      this.prisma.user.findMany(prismaQuery),
    ]);

    return { count, users };
  }

  async findOneById(id: UserIdentifier) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: Pick<User, 'email'>['email']) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneByEmailAndPassword(
    email: Pick<User, 'email'>['email'],
    password: Pick<User, 'password'>['password'],
  ) {
    return await this.prisma.user.findUnique({
      where: { email, password },
      include: {
        role: true,
      },
    });
  }

  async createOne(
    user: Pick<
      User,
      'roleId' | 'roleType' | 'email' | 'password' | 'firstName' | 'lastName'
    >,
  ) {
    return await this.prisma.user.create({
      data: { ...user },
      include: {
        role: true,
      },
    });
  }

  async updateOne(
    id: UserIdentifier,
    user: Pick<User, 'firstName' | 'lastName'>,
  ) {
    return await this.prisma.user.update({
      data: { ...user },
      where: { id },
    });
  }

  async setRefreshToken(
    id: UserIdentifier,
    refreshToken: Pick<User, 'refreshToken'>['refreshToken'],
  ) {
    return await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async deleteRefreshToken(userId: UserIdentifier) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  }
}

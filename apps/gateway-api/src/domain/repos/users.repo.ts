import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'api/libs/prisma/prisma.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';

@Injectable()
export class UsersRepo {
  constructor(private readonly prisma: PrismaService) {}

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
}

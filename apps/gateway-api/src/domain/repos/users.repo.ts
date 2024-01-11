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

  async setVerificationCode(id: UserIdentifier, code: string) {
    return await this.prisma.user.update({
      where: {id},
      data: {
        refreshToken: code
      }
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

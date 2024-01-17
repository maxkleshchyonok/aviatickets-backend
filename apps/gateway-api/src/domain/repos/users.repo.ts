import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'api/libs/prisma/prisma.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';

@Injectable()
export class UsersRepo {
  constructor(private readonly prisma: PrismaService) { }

  async findOneById(id: Pick<User, 'id'>['id']) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        devices: true
      }
    });
  }

  async findOneByEmail(email: Pick<User, 'email'>['email']) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        devices: true
      }
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

  async resetPassword(resetData: Pick<User, 'email' | 'password'>) {
    return await this.prisma.user.update({
      where: { email: resetData.email },
      data: {
        password: resetData.password,
      }
    });
  }

  async changePassword(data: Pick<User, 'id' | 'password'>) {
    return await this.prisma.user.update({
      where: {
        id: data.id
      },
      data: {
        password: data.password
      }
    });
  }

}

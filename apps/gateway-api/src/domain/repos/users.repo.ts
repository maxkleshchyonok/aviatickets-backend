import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'api/libs/prisma/prisma.service';

@Injectable()
export class UsersRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: Pick<User, 'email'>['email']) {
    return await this.prisma.user.findUnique({
      where: { email },
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
}

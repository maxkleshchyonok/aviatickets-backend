import { Module } from '@nestjs/common';
import { UsersRepo } from 'api/domain/repos/users.repo';
import { PrismaModule } from 'api/libs/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo],
})
export class UsersModule {}

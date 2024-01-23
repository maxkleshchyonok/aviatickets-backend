import { Module } from '@nestjs/common';
import { BookingsRepo } from 'libs/domain/src/repos/bookings.repo';
import { UsersRepo } from 'libs/domain/src/repos/users.repo';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, BookingsRepo],
})
export class UsersModule {}

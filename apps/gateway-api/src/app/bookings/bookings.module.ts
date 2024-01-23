import { Module } from '@nestjs/common';
import { BookingsRepo } from 'libs/domain/src/repos/bookings.repo';
import { PrismaModule } from 'libs/prisma/prisma.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepo],
})
export class BookingsModule {}

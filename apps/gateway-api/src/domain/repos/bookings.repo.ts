import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetAllBookingsQueryDto } from 'api/app/bookings/domain/get-all-bookings-query.dto';
import { PrismaService } from 'api/libs/prisma/prisma.service';

@Injectable()
export class BookingsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBookings(query: GetAllBookingsQueryDto) {
    const { pageNumber, pageSize } = query;

    const prismaQuery: Prisma.BookingFindManyArgs = {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        bookingItems: {
          include: {
            passenger: true,
            flight: true,
          },
          orderBy: {
            flightId: Prisma.SortOrder.asc,
          },
        },
        user: true,
      },
    };

    const [count, bookings] = await this.prisma.$transaction([
      this.prisma.booking.count({ where: prismaQuery.where }),
      this.prisma.booking.findMany(prismaQuery),
    ]);

    return { count, bookings };
  }
}

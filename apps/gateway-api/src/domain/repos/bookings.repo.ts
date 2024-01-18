import { Injectable } from '@nestjs/common';
import { Booking, Prisma } from '@prisma/client';
import { GetAllBookingsQueryDto } from 'api/app/bookings/domain/get-all-bookings-query.dto';
import { GetAllUserBookingsQueryDto } from 'api/app/users/domain/get-all-user-bookings.dto';
import { PrismaService } from 'api/libs/prisma/prisma.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';

@Injectable()
export class BookingsRepo {
  constructor(private readonly prisma: PrismaService) { }

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

  async findAllUserBookings(
    userId: UserIdentifier,
    query: GetAllUserBookingsQueryDto,
  ) {
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
      },
      where: {
        userId,
      },
    };

    const [count, bookings] = await this.prisma.$transaction([
      this.prisma.booking.count({ where: prismaQuery.where }),
      this.prisma.booking.findMany(prismaQuery),
    ]);

    return { count, bookings };
  }

  async findOneById(id: Pick<Booking, 'id'>['id']) {
    return await this.prisma.booking.findUnique({
      where: { id },
      include: {
        bookingItems: true,
      },
    });
  }

  async updateUserBooking(bookingData: Pick<Booking, 'id' | 'status'>) {
    const { id, status } = bookingData;
    return await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        bookingItems: true,
      }
    });
  }
}

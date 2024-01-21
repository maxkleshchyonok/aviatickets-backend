import { Injectable } from '@nestjs/common';
import { Booking, User, Prisma } from '@prisma/client';
import { GetAllBookingsQueryDto } from 'api/app/bookings/domain/get-all-bookings-query.dto';
import { GetAllUserBookingsQueryDto } from 'api/app/users/domain/get-all-user-bookings.dto';
import { PrismaService } from 'api/libs/prisma/prisma.service';
import { UserIdentifier } from 'api/types/model-identifiers.types';
import { CreateBookingDto } from '../dto/create-booking.dto';

@Injectable()
export class BookingsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBookings(query: GetAllBookingsQueryDto) {
    const { pageNumber, pageSize } = query;

    const prismaQuery: Prisma.BookingFindManyArgs = {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        toOriginRoute: true,
        toDestinationRoute: true,
        passengers: true,
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
        toOriginRoute: true,
        toDestinationRoute: true,
        passengers: true,
        user: true,
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
        toOriginRoute: true,
        toDestinationRoute: true,
        passengers: true,
        user: true,
      },
    });
  }

  async updateUserBooking(bookingData: Pick<Booking, 'id' | 'status'>) {
    const { id, status } = bookingData;
    return await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        toOriginRoute: true,
        toDestinationRoute: true,
        passengers: true,
        user: true,
      },
    });
  }

  async createBooking(booking: CreateBookingDto, user: Pick<User, 'id'>) {
    return await this.prisma.booking.create({
      data: {
        ...booking,
        toDestinationRoute: {
          connect: booking.toDestinationRoute.map((id) => ({id: id}))
        },
        toOriginRoute: {
          connect: booking.toOriginRoute.map((id) => ({id: id}))
        },
        passengers: {
          connect: booking.passengers.map((passenger) =>({passportId: passenger.passportId}))
        },
        user: {
          connect: {
            id: user.id
          }
        }
      },
      include: {
        toDestinationRoute: true,
        toOriginRoute: true,
        passengers: true,
        user: true
      }
    })
  }
}

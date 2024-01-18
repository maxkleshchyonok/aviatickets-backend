import { Injectable } from '@nestjs/common';
import { BookingsRepo } from 'api/domain/repos/bookings.repo';
import { GetAllBookingsQueryDto } from './domain/get-all-bookings-query.dto';
import { Booking } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private bookingsRepo: BookingsRepo) { }

  async findAllBookings(query: GetAllBookingsQueryDto) {
    return await this.bookingsRepo.findAllBookings(query);
  }

  async findBookingById(id: Pick<Booking, 'id'>['id']) {
    return await this.bookingsRepo.findOneById(id);
  }

  async updateOneBooking(id: string, body: Pick<Booking, 'status'>) {
    const updateData: Pick<Booking, 'id' | 'status'> = {
      id,
      status: body.status
    };
    return await this.bookingsRepo.updateUserBooking(updateData);
  }
}

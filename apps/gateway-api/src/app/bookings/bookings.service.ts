import { Injectable } from '@nestjs/common';
import { BookingsRepo } from 'api/domain/repos/bookings.repo';
import { GetAllBookingsQueryDto } from './domain/get-all-bookings-query.dto';

@Injectable()
export class BookingsService {
  constructor(private bookingsRepo: BookingsRepo) {}

  async findAllBookings(query: GetAllBookingsQueryDto) {
    return await this.bookingsRepo.findAllBookings(query);
  }
}

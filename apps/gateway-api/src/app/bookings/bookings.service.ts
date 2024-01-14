import { Injectable } from '@nestjs/common';
import { BookingsRepo } from 'api/domain/repos/bookings.repo';

@Injectable()
export class BookingsService {
  constructor(private bookingsRepo: BookingsRepo) {}
}

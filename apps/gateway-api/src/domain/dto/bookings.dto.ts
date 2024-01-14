import { Booking } from '@prisma/client';
import { BookingDto } from './booking.dto';

interface BookingsAndCount {
  count: number;
  bookings: Booking[];
}

export class BookingsDto {
  count: number;
  bookings: BookingDto[];

  static fromResponse({ count, bookings }: BookingsAndCount) {
    const it = new BookingsDto();
    it.count = count;
    it.bookings = BookingDto.fromEntities(bookings);
    return it;
  }
}

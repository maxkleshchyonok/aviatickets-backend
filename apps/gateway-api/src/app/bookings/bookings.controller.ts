import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BookingsDto } from 'api/domain/dto/bookings.dto';
import { JwtPermissionsGuard } from 'api/libs/security/guards/jwt-permissions.guard';
import { BookingsService } from './bookings.service';
import { GetAllBookingsQueryDto } from './domain/get-all-bookings-query.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(JwtPermissionsGuard)
  async getAllBookings(@Query() query: GetAllBookingsQueryDto) {
    const bookingsWithCount = await this.bookingsService.findAllBookings(query);
    return BookingsDto.fromResponse(bookingsWithCount);
  }
}

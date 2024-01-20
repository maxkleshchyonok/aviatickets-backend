import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsDto } from 'api/domain/dto/bookings.dto';
import { JwtPermissionsGuard } from 'api/libs/security/guards/jwt-permissions.guard';
import { BookingsService } from './bookings.service';
import { GetAllBookingsQueryDto } from './domain/get-all-bookings-query.dto';
import { UpdateBookingForm } from './domain/updateBooking.form';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { BookingDto } from 'api/domain/dto/booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(JwtPermissionsGuard)
  async getAllBookings(@Query() query: GetAllBookingsQueryDto) {
    const bookingsWithCount = await this.bookingsService.findAllBookings(query);
    return BookingsDto.fromResponse(bookingsWithCount);
  }

  @Post(':id')
  //@UseGuards(JwtPermissionsGuard)
  async updateOneBooking(
    @Param('id') id: string,
    @Body() body: UpdateBookingForm,
  ) {
    const booking = await this.bookingsService.findBookingById(id);
    if (!booking) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotFound);
    }
    const updatedBooking = await this.bookingsService.updateOneBooking(
      id,
      body,
    );
    if (!updatedBooking) {
      throw new InternalServerErrorException(ErrorMessage.RecordUpdationFailed);
    }
    return BookingDto.fromEntity(updatedBooking);
  }
}

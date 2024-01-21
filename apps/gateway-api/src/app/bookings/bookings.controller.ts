import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingsDto } from 'api/domain/dto/bookings.dto';
import { JwtPermissionsGuard } from 'api/libs/security/guards/jwt-permissions.guard';
import { BookingsService } from './bookings.service';
import { GetAllBookingsQueryDto } from './domain/get-all-bookings-query.dto';
import { UpdateBookingForm } from './domain/updateBooking.form';
import { ErrorMessage } from 'api/enums/error-message.enum';
import { BookingDto } from 'api/domain/dto/booking.dto';
import { CreateBookingForm } from './domain/create-booking.form';
import { CurrentUser } from 'api/libs/security/decorators/current-user.decorator';
import { UserSessionDto } from 'api/domain/dto/user-session.dto';
import { PassengerAmount } from '../routes/domain/get-routes-query.dto';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(JwtPermissionsGuard)
  async getAllBookings(@Query() query: GetAllBookingsQueryDto) {
    const bookingsWithCount = await this.bookingsService.findAllBookings(query);
    return BookingsDto.fromResponse(bookingsWithCount);
  }

  @Post(':id')
  //@UseGuards(JwtPermissionsGuard)
  async updateOneBooking(@Param('id') id: string, @Body() body: UpdateBookingForm) {
    const booking = await this.bookingsService.findBookingById(id);
    if (!booking) {
      throw new InternalServerErrorException(ErrorMessage.RecordNotFound);
    }
    const updatedBooking = await this.bookingsService.updateOneBooking(id, body);
    if (!updatedBooking) {
      throw new InternalServerErrorException(ErrorMessage.RecordUpdationFailed);
    }
    return BookingDto.fromEntity(updatedBooking);
  }

  @Post()
  @UseGuards(JwtPermissionsGuard)
  async createBooking(@Body() body: CreateBookingForm, @CurrentUser() user: UserSessionDto) {
    body.toDestinationRoute.map(async (flightId) => {
      const existingFlight = await this.bookingsService.findFlight(flightId)
      if (!existingFlight) {
        throw new InternalServerErrorException(ErrorMessage.DestinationFlightDoesNotExist)
      }
    })

    body.toOriginRoute.map(async (flightId) => {
      const existingFlight = await this.bookingsService.findFlight(flightId)
      if (!existingFlight) {
        throw new InternalServerErrorException(ErrorMessage.OriginFlightDoesNotExist)
      }
    })

    body.passengers.map(async (passenger) => {
      const createdPassenger = await this.bookingsService.createNecessaryPassenger(passenger)
      if (!createdPassenger) {
        throw new InternalServerErrorException(ErrorMessage.PassengerCreationFailed)
      }
    })

    const enoughAvailableSeats = await this.bookingsService.decreaseFlightsAvailableSeatsAmount(
      body.toOriginRoute.concat(body.toDestinationRoute), body.passengers.length
    )
    if (!enoughAvailableSeats) {
      throw new InternalServerErrorException(ErrorMessage.NotEnoughAvailableSeats)
    }

    const booking = await this.bookingsService.createBooking(body, user)
    if (!booking) {
      throw new InternalServerErrorException(ErrorMessage.RecordCreationFailed)
    }

    return BookingDto.fromEntity(booking)
  }
}

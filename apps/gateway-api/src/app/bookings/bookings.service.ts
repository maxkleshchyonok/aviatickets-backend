import { Injectable } from '@nestjs/common';
import { BookingsRepo } from 'api/domain/repos/bookings.repo';
import { GetAllBookingsQueryDto } from './domain/get-all-bookings-query.dto';
import { Booking, Passenger, User } from '@prisma/client';
import { PassengersRepo } from 'api/domain/repos/passengers.repo';
import { FlightsRepo } from 'api/domain/repos/flights.repo';
import { CreateBookingDto } from 'api/domain/dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private bookingsRepo: BookingsRepo,
    private passengerRepo: PassengersRepo,
    private flightRepo: FlightsRepo
    ) { }

  async findAllBookings(query: GetAllBookingsQueryDto) {
    return await this.bookingsRepo.findAllBookings(query);
  }

  async findBookingById(id: Pick<Booking, 'id'>['id']) {
    return await this.bookingsRepo.findOneById(id);
  }

  async updateOneBooking(id: string, body: Pick<Booking, 'status'>) {
    const updateData: Pick<Booking, 'id' | 'status'> = {
      id,
      status: body.status,
    };
    return await this.bookingsRepo.updateUserBooking(updateData);
  }

  async decreaseFlightsAvailableSeatsAmount(flightIds: string[], amount: number) {
    return await this.flightRepo.decreaseSeatAmount(flightIds, amount)
  }

  async createBooking(booking: CreateBookingDto, user: Pick<User, 'id'>) {
    return await this.bookingsRepo.createBooking(booking, user)
  }

  async createNecessaryPassenger(
    passenger: Pick<Passenger, 'lastName' | 'firstName' | 'passportId'>) {
        const exists = await this.passengerRepo.findOneByPassport(passenger)
        if (!exists) {
          return await this.passengerRepo.createPassenger(passenger)
        }
        return exists
  }

  async findFlight(flight: string) {
    return await this.flightRepo.findManyById(flight)
  }
}

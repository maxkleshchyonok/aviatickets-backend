import { BookingStatuses, Cities } from '@prisma/client';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { IsEnum, IsNumber, ValidateNested, IsUUID } from 'class-validator';
import { FlightDto } from 'api/domain/dto/flight.dto';
import { PassengerDto } from 'api/domain/dto/passenger.dto';
import { Type } from 'class-transformer';
import { CreateBookingDto } from 'api/domain/dto/create-booking.dto';

export class CreateBookingForm extends CreateBookingDto {}

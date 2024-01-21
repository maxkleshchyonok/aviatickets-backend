import { Booking, BookingStatuses, Cities, User, Flight, Passenger} from '@prisma/client';
import { UserDto } from './user.dto';
import { UUIDDto } from './uuid.dto';
import { FlightDto } from './flight.dto';
import { PassengerDto } from './passenger.dto';

export class BookingDto extends UUIDDto {
  status: BookingStatuses;
  price: number;
  user: UserDto;
  origin: Cities;
  destination: Cities;
  passengers: PassengerDto[]
  toDestinationRoute: FlightDto[];
  toOriginRoute: FlightDto[];

  static fromEntity(
    entity?: Booking 
    & { user?: User } 
    & { toDestinationRoute?: Flight[] } 
    & {toOriginRoute? : Flight[]}
    & {passengers?: Passenger[]}
  ) {
    if (!entity) {
      return;
    }

    const it = new BookingDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.status = entity.status;
    it.price = entity.price;
    it.destination = entity.destination;
    it.origin = entity.origin;
    it.user = UserDto.fromEntity(entity.user);
    it.passengers = PassengerDto.fromEntities(entity.passengers)
    it.toDestinationRoute = FlightDto.fromEntities(entity.toDestinationRoute);
    it.toOriginRoute = FlightDto.fromEntities(entity.toOriginRoute);
    return it;
  }

  static fromEntities(entities?: Booking[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}

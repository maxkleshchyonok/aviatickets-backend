import { BookingItem, Flight, Passenger } from '@prisma/client';
import { FlightDto } from './flight.dto';
import { PassengerDto } from './passenger.dto';
import { UUIDDto } from './uuid.dto';

export class BookingItemDto extends UUIDDto {
  price: number;
  passenger: PassengerDto;
  flight: FlightDto;

  static fromEntity(
    entity?: BookingItem & { passenger?: Passenger } & { flight?: Flight },
  ) {
    if (!entity) {
      return;
    }

    const it = new BookingItemDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.price = entity.price;
    it.passenger = PassengerDto.fromEntity(entity.passenger);
    it.flight = FlightDto.fromEntity(entity.flight);
    return it;
  }

  static fromEntities(entities?: BookingItem[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}

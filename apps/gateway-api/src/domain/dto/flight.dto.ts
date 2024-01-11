import { Cities, Flight, FlightStatuses } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class FlightDto extends UUIDDto {
  originCity: Cities;
  destinationCity: Cities;
  departureTime: number;
  arrivalTime: number;
  status: FlightStatuses;
  price: number;
  seatAmount: number;
  availableSeatAmount: number;

  static fromEntity(entity?: Flight) {
    if (!entity) {
      return;
    }

    const it = new FlightDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.originCity = entity.originCity;
    it.destinationCity = entity.destinationCity;
    it.arrivalTime = entity.arrivalTime.valueOf();
    it.departureTime = entity.departureTime.valueOf();
    it.status = entity.status;
    it.price = entity.price;
    it.seatAmount = entity.seatAmount;
    it.availableSeatAmount = entity.availableSeatAmount;
    return it;
  }

  static fromEntities(entities?: Flight[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}

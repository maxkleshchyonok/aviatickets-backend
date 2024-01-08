import { Flight } from '@prisma/client';
import { UUIDDto } from './uuid.dto';

export class FlightDto extends UUIDDto {
  originCity: string;
  destinationCity: string;
  departureTime: number;
  arrivalTime: number;
  status: string;
  price: number;

  static fromEntity(entity?: Flight) {
    if (!entity) {
      return;
    }

    const it = new FlightDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.originCity = entity.originCity.replace(/_/g, ' ');
    it.destinationCity = entity.destinationCity.replace(/_/g, ' ');
    it.arrivalTime = entity.arrivalTime.valueOf();
    it.departureTime = entity.departureTime.valueOf();
    it.status = entity.status;
    it.price = entity.price;

    return it;
  }

  static fromEntities(entities?: Flight[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}

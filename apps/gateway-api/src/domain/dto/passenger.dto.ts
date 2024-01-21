import { Passenger } from '@prisma/client';
import { UUIDDto } from './uuid.dto';
import { IsString } from 'class-validator';

export class PassengerDto extends UUIDDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  passportId: string;

  static fromEntity(entity?: Passenger) {
    if (!entity) {
      return;
    }

    const it = new PassengerDto();
    it.id = entity.id;
    it.createdAt = entity.createdAt.valueOf();
    it.updatedAt = entity.updatedAt.valueOf();
    it.firstName = entity.firstName;
    it.lastName = entity.lastName;
    it.passportId = entity.passportId;
    return it;
  }

  static fromEntities(entities?: Passenger[]) {
    if (!entities?.map) {
      return;
    }

    return entities.map((entity) => this.fromEntity(entity));
  }
}

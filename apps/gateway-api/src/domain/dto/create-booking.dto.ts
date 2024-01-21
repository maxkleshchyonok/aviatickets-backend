import { Cities } from '@prisma/client';
import { IsEnum, IsNumber, ValidateNested, IsUUID } from 'class-validator';
import { PassengerDto } from 'api/domain/dto/passenger.dto';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  price: number;

  @IsEnum(Cities)
  origin: Cities;

  @IsEnum(Cities)
  destination: Cities;

  @IsUUID(undefined, { each: true })
  toDestinationRoute: string[];

  @IsUUID(undefined, { each: true })
  toOriginRoute: string[];

  @ValidateNested()
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}

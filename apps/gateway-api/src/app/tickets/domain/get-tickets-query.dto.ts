import { Cities } from '@prisma/client';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { PaginationQueryDto } from 'api/domain/dto/pagination-query.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export enum PassengerAmount {
  Min = 1,
  Max = 10,
}

export class GetTicketsQueryDto extends PaginationQueryDto {
  @IsEnum(Cities)
  @RemoveExtraSpaces()
  originCity: Cities;

  @IsEnum(Cities)
  @RemoveExtraSpaces()
  destinationCity: Cities;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @Type(() => Date)
  @RemoveExtraSpaces()
  departureTime: Date;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @Type(() => Date)
  @RemoveExtraSpaces()
  arrivalTime?: Date;

  @Max(PassengerAmount.Max)
  @Min(PassengerAmount.Min)
  @Transform(({ value }) => Number(value))
  passengerAmount: number;
}

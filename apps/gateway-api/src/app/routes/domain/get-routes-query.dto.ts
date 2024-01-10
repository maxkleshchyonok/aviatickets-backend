import { Cities } from '@prisma/client';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinDate,
} from 'class-validator';

export class GetRoutesQueryDto {
  @IsEnum(Cities)
  @RemoveExtraSpaces()
  originCity: Cities;

  @IsEnum(Cities)
  @RemoveExtraSpaces()
  destinationCity: Cities;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  @RemoveExtraSpaces()
  departureDate: Date;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  @RemoveExtraSpaces()
  arrivalDate?: Date;
}

import { Cities } from '@prisma/client';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { IsEnum } from 'class-validator';

export class GetRoutesQueryDto {
  @IsEnum(Cities)
  @RemoveExtraSpaces()
  originCity: Cities;

  @IsEnum(Cities)
  @RemoveExtraSpaces()
  destinationCity: Cities;
}

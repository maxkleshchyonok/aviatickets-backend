import { BookingStatuses } from '@prisma/client';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { IsEnum } from 'class-validator';

export class UpdateBookingForm {
  @IsEnum(BookingStatuses)
  @RemoveExtraSpaces()
  status: BookingStatuses;
}

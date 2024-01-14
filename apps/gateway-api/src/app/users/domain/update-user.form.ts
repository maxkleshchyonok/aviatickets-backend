import { IsString, Length } from 'class-validator';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';

enum FirstName {
  MinLength = 2,
  MaxLength = 50,
}

enum LastName {
  MinLength = 2,
  MaxLength = 50,
}

export class UpdateUserForm {
  @Length(FirstName.MinLength, FirstName.MaxLength)
  @IsString()
  @RemoveExtraSpaces()
  firstName: string;

  @Length(LastName.MinLength, LastName.MaxLength)
  @IsString()
  @RemoveExtraSpaces()
  lastName: string;
}

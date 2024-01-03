import { IsEmail, IsString, Matches } from 'class-validator';
import { RemoveExtraSpaces } from '../../../decorators/remove-extra-spaces.decorator';
import { STRONG_PASSWORD_REG_EXP } from '../constants/auth.constants';

export class SignUpForm {
  @IsEmail()
  @IsString()
  @RemoveExtraSpaces()
  email: string;

  @Matches(STRONG_PASSWORD_REG_EXP)
  @IsString()
  @RemoveExtraSpaces()
  password: string;
}

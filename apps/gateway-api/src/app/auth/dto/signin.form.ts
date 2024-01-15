import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { STRONG_PASSWORD_REG_EXP } from '../constants/auth.constants';

export class SignInForm {
  @IsEmail()
  @IsString()
  @RemoveExtraSpaces()
  email: string;

  @Matches(STRONG_PASSWORD_REG_EXP)
  @IsString()
  @RemoveExtraSpaces()
  password: string;

  @IsString()
  @IsNotEmpty()
  @RemoveExtraSpaces()
  deviceId: string;
}

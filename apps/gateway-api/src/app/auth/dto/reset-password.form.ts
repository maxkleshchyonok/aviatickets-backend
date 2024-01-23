import { IsString, Matches, validate } from 'class-validator';
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { STRONG_PASSWORD_REG_EXP } from 'apps/gateway-api/src/app/auth/constants/auth.constants';

export class ResetPasswordForm {
  @Matches(STRONG_PASSWORD_REG_EXP)
  @IsString()
  @RemoveExtraSpaces()
  password: string;

  @Matches(STRONG_PASSWORD_REG_EXP)
  @IsString()
  @RemoveExtraSpaces()
  confirmPassword: string;

  static from(form?: ResetPasswordForm) {
    const it = new ResetPasswordForm();
    it.password = form?.password;
    return it;
  }

  static async validate(form: ResetPasswordForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}

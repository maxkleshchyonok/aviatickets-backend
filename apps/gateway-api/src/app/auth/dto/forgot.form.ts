import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  validate,
} from 'class-validator';

export class ForgotForm {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsUUID()
  public deviceId: string;

  static from(form?: ForgotForm) {
    const it = new ForgotForm();
    it.email = form.email;
    return it;
  }

  static async validate(form: ForgotForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}

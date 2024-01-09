import { IsEmail, IsNotEmpty, validate } from "class-validator";

export class ForgotForm {
    @IsNotEmpty()
    @IsEmail()
    public email: string

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
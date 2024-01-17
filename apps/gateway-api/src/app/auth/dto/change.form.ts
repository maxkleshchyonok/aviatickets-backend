import { RemoveExtraSpaces } from "api/decorators/remove-extra-spaces.decorator";
import { IsNotEmpty, IsString, validate } from "class-validator";

export class ChangePasswordForm {
    @IsNotEmpty()
    @IsString()
    @RemoveExtraSpaces()
    public password: string

    static from(form?: ChangePasswordForm) {
        const it = new ChangePasswordForm();
        it.password = form.password;
        return it;
    }

    static async validate(form: ChangePasswordForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }
}
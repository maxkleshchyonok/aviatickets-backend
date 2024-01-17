import { RemoveExtraSpaces } from "api/decorators/remove-extra-spaces.decorator";
import { IsNotEmpty, IsString, validate } from "class-validator";

export class ChangePasswordForm {
    @IsNotEmpty()
    @IsString()
    @RemoveExtraSpaces()
    public oldPassword: string

    @IsNotEmpty()
    @IsString()
    @RemoveExtraSpaces()
    public newPassword: string

    @IsNotEmpty()
    @IsString()
    @RemoveExtraSpaces()
    public confirmNewPassword: string

    static from(form?: ChangePasswordForm) {
        const it = new ChangePasswordForm();
        it.oldPassword = form.oldPassword;
        it.newPassword = form.newPassword;
        return it;
    }

    static async validate(form: ChangePasswordForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }
}
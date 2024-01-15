import { IsString, Matches, validate } from "class-validator";
import { RemoveExtraSpaces } from 'api/decorators/remove-extra-spaces.decorator';
import { STRONG_PASSWORD_REG_EXP } from "apps/gateway-api/src/app/auth/constants/auth.constants";

export class ResetForm {

    @Matches(STRONG_PASSWORD_REG_EXP)
    @IsString()
    @RemoveExtraSpaces()
    password: string;

    static from(form?: ResetForm) {
        const it = new ResetForm();
        it.password = form?.password;
        return it;
    }

    static async validate(form: ResetForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }

}
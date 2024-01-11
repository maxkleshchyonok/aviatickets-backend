import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, validate } from "class-validator";
import { VERIFY_CODE_REG_EXP } from "../constants/auth.constants";

export class VerifyForm {

    @IsNotEmpty()
    @IsNumber()
    public code: number

    @IsEmail()
    public email: string


    static from(form?: VerifyForm) {
        const it = new VerifyForm();
        it.code = form?.code;
        it.email = form?.email;
        return it;
    }

    static async validate(form: VerifyForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }

}
import { IsNumber, validate } from "class-validator";

export class VerifyForm {
    @IsNumber()
    public code: number

    static from(form?: VerifyForm) {
        const it = new VerifyForm();
        it.code = form?.code;
        return it;
    }

    static async validate(form: VerifyForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }

}
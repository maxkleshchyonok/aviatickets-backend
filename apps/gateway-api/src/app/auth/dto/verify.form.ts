import { Device } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID, validate } from "class-validator";

export class VerifyForm {

    @IsNotEmpty()
    @IsUUID()
    public deviceId: string;

    @IsEmail()
    public email: string

    @IsNumber()
    public code: number

    static from(form?: VerifyForm) {
        const it = new VerifyForm();
        it.deviceId = form?.deviceId;
        it.email = form?.email;
        return it;
    }

    static async validate(form: VerifyForm) {
        const errors = await validate(form);
        return errors.length ? errors : false;
    }

}
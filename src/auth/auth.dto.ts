import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SignUpOBJ{

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}

export class SignInOBJ{

    @IsString()
    @IsNotEmpty()
    login: string;//can either be an email or a username

    @IsString()
    @IsNotEmpty()
    password: string;

}

export class VerificationCodeOBJ{

    @IsNumber()
    @IsNotEmpty()
    code: number;

    @IsString()
    @IsNotEmpty()
    email: string;

}
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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

    @IsString()
    @IsNotEmpty()
    code: number;

    @IsString()
    @IsNotEmpty()
    email: string;

}
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO{

    @IsNotEmpty()
    @IsString()
    userName: String;

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: String;

    @IsNotEmpty()
    @IsString()
    password: String;

}

export class UpdateCharacterDTO{

    @IsNotEmpty()
    @IsString()
    top: String;

    @IsNotEmpty()
    @IsString()
    head: String;

    @IsNotEmpty()
    @IsString()
    body: String;

}

export class UpdateUserDTO{

    @IsNotEmpty()
    @IsString()
    userName: String;

    @IsNotEmpty()
    @IsString()
    bio: String;

    @IsNotEmpty()
    @IsString()
    funFacts: String[];

}
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCharacterDTO{

    @IsNotEmpty()
    @IsString()
    id: String

    @IsNotEmpty()
    @IsString()
    hat: String;

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
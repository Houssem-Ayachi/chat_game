import { IsArray, IsNotEmpty, IsString } from "class-validator";

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

export class UpdateProfileDTO{

    @IsNotEmpty()
    @IsString()
    id: String;

    @IsNotEmpty()
    @IsString()
    userName: String;

    @IsNotEmpty()
    @IsString()
    bio: String;

    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    funFacts: String[];
    
}
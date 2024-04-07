import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateCharacterDTO{

    @IsNotEmpty()
    @IsString()
    hat: String;

    @IsNotEmpty()
    @IsString()
    head: String;

}

export class UpdateProfileDTO{

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
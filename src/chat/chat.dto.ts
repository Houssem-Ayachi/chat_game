import { IsNotEmpty, IsString } from "class-validator";

export class ChatInReqDTO{
    @IsString()
    @IsNotEmpty()
    chatId: string;
}

export class CreateMessageDTO{

    @IsString()
    @IsNotEmpty()
    chatId: string;

    @IsString()
    message: string;

    @IsString()
    sticker: string;

}
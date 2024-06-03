import { IsNotEmpty, IsString } from "class-validator";

export class StickerToBuy{
    @IsString()
    @IsNotEmpty()
    stickerId: string;
}


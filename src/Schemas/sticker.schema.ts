import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { v4 as uuid } from "uuid";

export type StickerDocument = HydratedDocument<Sticker>;

@Schema({
    timestamps: true
})
export class Sticker{
    @Prop({
        unique: true,
        default: function genuuid(){
            return uuid();
        }
    })
    id: String;

    @Prop({required: true})
    imageId: String; //image name in frontend

    @Prop({required: true})
    price: number;

}

export const StickerSchema = SchemaFactory.createForClass(Sticker);
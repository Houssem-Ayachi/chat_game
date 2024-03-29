import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { v4 as uuid } from "uuid";
import { Sticker } from "./sticker.schema";
import { User } from "./user.schema";

export type StoreDocument = HydratedDocument<Store>;

//serves as logging for all the transactions made by users in the store
@Schema({
    timestamps: true
})
export class Store{

    @Prop({
        unique: true,
        default: function genuuid(){
            return uuid();
        }
    })
    id: String;

    @Prop({required: true, ref: "Sticker", type: MSchema.Types.ObjectId})
    stickerId: Sticker;

    @Prop({required: true, ref: "User", type: MSchema.Types.ObjectId})
    userId: User;

}

export const StoreSchema = SchemaFactory.createForClass(Store);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { v4 as uuid } from "uuid";
import { Sticker } from "./sticker.schema";

export type TradeDocument = HydratedDocument<Trade>;

@Schema({
    timestamps: true
})
export class Trade{

    @Prop({
        unique: true,
        default: function genuuid(){
            return uuid();
        }
    })
    id: String;

    @Prop({required: true})
    user1Id: String;

    @Prop({required: true})
    user2Id: String;

    @Prop({type: [{ref: "Sticker", type: MSchema.Types.ObjectId}]})
    user1StickersTraded: Sticker[];

    @Prop({type: [{ref: "Sticker", type: MSchema.Types.ObjectId}]})
    user2StickersTraded: Sticker[];

}

export const TradeSchema = SchemaFactory.createForClass(Trade);
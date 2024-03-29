import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { v4 as uuid } from "uuid";
import { Sticker } from "./sticker.schema";

export type LevelDocument = HydratedDocument<Level>;

@Schema({
    timestamps: true
})
export class Level{
    @Prop({
        unique: true,
        default: function genuuid(){
            return uuid();
        }
    })
    id: String;

    @Prop({required: true})
    rank: number;

    @Prop({required: true})
    xpCeiling: number;

    @Prop({type: [{ref: "Sticker", type: MSchema.Types.ObjectId}]})
    rewards: Sticker[];
}

export const LevelSchema = SchemaFactory.createForClass(Level);
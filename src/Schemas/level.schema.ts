import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { v4 as uuid } from "uuid";

export type LevelDocument = HydratedDocument<Level>;

export type LevelType = {
    rank: number;
    xpCeiling: number;
}

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
}

export const LevelSchema = SchemaFactory.createForClass(Level);
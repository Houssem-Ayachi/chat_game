import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { v4 as uuid } from "uuid";
import { Message } from "./message.schema";

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
    timestamps: true
})
export class Chat{
    @Prop({
        unique: true,
        default: function genuuid(){
            return uuid();
        }
    })
    id: String;

    @Prop([String])
    chatters: String[]; //chatters' ids

    @Prop([{ref: "Message", type: MSchema.Types.ObjectId}])
    messages: Message[];

    @Prop()
    level: number;

}

export const ChatSchema = SchemaFactory.createForClass(Chat);
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { v4 as uuid } from "uuid";

export type ChatDocument = HydratedDocument<Chat>;

export class MessageObj {
    senderId: string;
    chatId: string;
    content: string;
    sticker: string;
    
    constructor(senderId: string, chatId: string, content: string, sticker: string){
        this.senderId = senderId;
        this.chatId = chatId;
        this.content = content;
        this.sticker = sticker;
    }
}

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

    @Prop([{type: MessageObj}])
    messages: MessageObj[];

    @Prop({default: 1})
    level: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
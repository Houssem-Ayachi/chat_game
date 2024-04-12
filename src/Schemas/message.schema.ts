import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema} from "mongoose";
import { v4 as uuid } from "uuid";

export type MessageDocument = HydratedDocument<Message>;

//Note: a message can hold both text and a sticker
//so a stickerId prop is added besides the contentText prop
@Schema({
    timestamps: true
})
export class Message{
    @Prop({
        unique: true,
        default: function genuuid(){
            return uuid();
        }
    })
    id: String;

    @Prop(String)
    senderId: String //sender's id

    @Prop(String)
    chatId: String //chat's id

    @Prop()
    contentText: String;

    @Prop()
    stickerId: String; //id of the sticker sent (stickers are saved in the frontend to reduce complexity)
}

export const MessageSchema = SchemaFactory.createForClass(Message);
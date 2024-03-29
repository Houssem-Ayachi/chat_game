import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema} from "mongoose";
import { v4 as uuid } from "uuid";
import { User } from "./user.schema";
import { Chat } from "./chat.schema";

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

    @Prop({required: true, ref: "User", type: MSchema.Types.ObjectId})
    senderId: User //sender's id

    @Prop({required: true, ref: "Chat", type: MSchema.Types.ObjectId})
    chatId: Chat //chat's id

    @Prop()
    contentText: String;

    @Prop()
    stickerId: String; //id of the sticker sent (stickers are saved in the frontend to save complexity)

}

export const MessageSchema = SchemaFactory.createForClass(Message);
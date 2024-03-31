import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { v4 as uuid } from "uuid";
import { Sticker } from "./sticker.schema";
import { Chat } from "./chat.schema";
import { Level } from "./level.schema";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true
})
export class User{

    @Prop({required: true})
    userName: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({require: true, ref: "Level", type: MSchema.Types.ObjectId})
    level: Level; // the user's current level

    @Prop({default: 0})
    currentXp: number;

    @Prop({default: false})
    isVerified: boolean;

    @Prop({default: 0})
    points: number;

    @Prop({
        type: {hat: String, head: String, body: String},
        default: {hat: "hat1", head: "head1", "body": "body1"}
    })
    character: {hat: string, head: string, body: string}

    @Prop()
    bio: string;

    @Prop([String])
    funFacts: string[];

    @Prop([String])
    friendsIds: string[]; //list of the user's friends' ids (not sure if this is the best way)

    @Prop([{ref: "Sticker", type: MSchema.Types.ObjectId}])
    storage: Sticker[]; //list of purchased stickers

    @Prop([{ref: "Chat", type: MSchema.Types.ObjectId}])
    activeChats: Chat[] //list of user's chats' ids

    @Prop([{ref: "Chat", type: MSchema.Types.ObjectId}])
    mutedChats: Chat[]; //list of chats ids marked as muted
    @Prop([{ref: "Chat", type: MSchema.Types.ObjectId}])
    blockedChats: Chat[] //list of chats ids marked as blocked
    
}

export const UserSchema = SchemaFactory.createForClass(User);
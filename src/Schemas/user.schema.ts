import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { Sticker } from "./sticker.schema";
import { Chat } from "./chat.schema";
import { Level } from "./level.schema";
import { v4 } from "uuid";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true
})
export class User{
    @Prop({
        default: v4(),
        unique: true
    })
    id: string;

    @Prop({default: "guest"})
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
        default: {hat: "hat1", head: "head1"}
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

    @Prop([String])
    activeChats: String[] //list of user's chats' ids
    @Prop([String])
    mutedChats: String[]; //list of chats ids marked as muted
    @Prop([String])
    blockedChats: String[] //list of chats ids marked as blocked
}

export const UserSchema = SchemaFactory.createForClass(User);
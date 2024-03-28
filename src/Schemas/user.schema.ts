import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{

    @Prop()
    name: String;

    @Prop()
    bio: String;

    @Prop([String])
    funFacts: String[];

}

export const UserSchema = SchemaFactory.createForClass(User);
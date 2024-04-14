import { Types } from "mongoose";

export class UserInsideRequest{

    userId: Types.ObjectId;
    isVerified: boolean;

    constructor(userId: string, isVerified: boolean){
        this.userId = new Types.ObjectId(userId);
        this.isVerified = isVerified;
    }

}
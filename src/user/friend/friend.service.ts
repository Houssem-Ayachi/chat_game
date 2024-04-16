import { BadRequestException, Injectable } from "@nestjs/common";
import { AddFriendDTO } from "../user.dto";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "src/Schemas/user.schema";
import { UserService } from "../user/user.service";
import { InjectModel } from "@nestjs/mongoose";
import { ChatService } from "src/chat/chat.service";

@Injectable()
export class FriendService{

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly userService: UserService,
        private readonly chatService: ChatService,
    ){}

    async getFriends(userId: string){
        const user = await this.userService.getUser(userId);
        return await this.userModel.find(
            {_id: {$in: user.friendsIds.map(id => new Types.ObjectId(id))}
        }).select({"userName": true, "character": true, "storage": true});
    }

    //NOTE: some error handling can be done here (the update calls)
    async addFriend(friendObj: AddFriendDTO, userId: string){    
        const friend = await this.userService.getUser(friendObj.id);
        const user = await this.userService.getUser(userId);
        if(friend.friendsIds.indexOf(user._id.toString()) !== -1){
            return await this.chatService.getChatInfo(userId, friendObj.id);
        }
        //creating a chat for the both of them
        const chat = await this.chatService.createChat([userId, friend._id.toString()]);
        friend.friendsIds.push(user._id.toString());
        user.friendsIds.push(friend._id.toString());
        //adding the new chat id to their activeChats list
        user.activeChats.push(chat.chatId);
        friend.activeChats.push(chat.chatId);
        //update each user so he has the other's id in his friends list and their common chat in their activeChats list
        await this.userModel.updateOne({_id: friend._id}, {friendsIds: friend.friendsIds, activeChats: friend.activeChats});
        await this.userModel.updateOne({_id: user._id}, {friendsIds: user.friendsIds, activeChats: user.activeChats});
        return chat;
    }

    async unfriend(friendObj: AddFriendDTO, userId: string){
        const friend = await this.userService.getUser(friendObj.id);
        const user = await this.userService.getUser(userId);
        const friendIdx = user.friendsIds.indexOf(friend._id.toString());
        if(friendIdx === -1){
            throw new BadRequestException("not friends");
        }
        friend.friendsIds = user.friendsIds.filter(id => id !== friend._id.toString());
        user.friendsIds = friend.friendsIds.filter(id => id !== user._id.toString());
        await this.userModel.updateOne({_id: friend._id}, {friendsIds: friend.friendsIds});
        await this.userModel.updateOne({_id: user._id}, {friendsIds: user.friendsIds});
        return {response: "success"};
    }
}
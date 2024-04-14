import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/Schemas/user.schema';
import { SignUpOBJ } from 'src/auth/auth.dto';
import { UpdateCharacterDTO, UpdateProfileDTO } from '../user.dto';
import { Socket } from 'net';
import { sendFriendConnectedEvent, sendFriendDisconnedEvent} from './userEvents';
import { CustomError } from 'src/globals/Errors';
import { SimpleResponseMessage } from 'src/globals/Responses';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ){}
 
    //user's id mapped to his socket instance
    onlineUsers: Map<string, Socket> = new Map();

    async findUserByName(name: string, id: Types.ObjectId){
        const users = await this.userModel.find(
            {userName: {$regex: name, $options: "i"},
            _id: {$ne: id}
        })
        .select({"_id": true, "userName": true, "character": true});
        return users;
    }

    async getUser(id: string, filter?: boolean){
        const user = await this.userModel.findById(id);
        if(user == null){
            throw new BadRequestException("user doesn't exist");
        }
        return user;
    }

    async getFilteredUser(id: string){
        const user = await this.userModel.findById(id)
        .select({"_id": true, "userName": true, "character": true});
        if(user == null){
            throw new BadRequestException("user doesn't exist");
        }
        return user;
    }

    async addUser(signupObj: SignUpOBJ){
        return await this.userModel.create({...signupObj});
    }

    //TODO: maybe implement this?
    async removeUser(id: string){

    }

    async updateProfile(updateUserDTO: UpdateProfileDTO, _id: Types.ObjectId){
        let {bio, funFacts, userName} = updateUserDTO;
        const ack = await this.userModel.updateOne({_id}, 
            {
                bio, 
                funFacts,
                userName,
            });
        if(ack.modifiedCount == 1){
            return {response: "success"};
        }
        throw new BadRequestException("couldn't update user");
    }

    async updateCharacter(updateCharacterDTO: UpdateCharacterDTO, _id: Types.ObjectId){
        let {hat, head} = updateCharacterDTO;
        const ack = await this.userModel.updateOne({_id}, {character: {hat, head}});
        if(ack.modifiedCount == 1){
            return {response: "success"};
        }
        throw new BadRequestException("couldn't update character");
    }

    async getUserByEmail(email: string){
        return await this.userModel.findOne({email});
    }

    async markUserAsVerified(email: string){
        await this.userModel.updateOne({email}, {isVerified: true})
    }

    //login can either be an email or a username
    public async findUserByLogin(login: string){
        const user = await this.userModel.findOne({$or: [{email: login}, {userName: login}]});
        return user;
    }

    public async removeChatFromUser(chatId: string, userId: string){
        const user = await this.getUser(userId);
        const newChats = user.activeChats.filter(chId => chId.toString() != chatId);
        await this.userModel.updateOne({_id: userId}, {activeChats: newChats});
    }

    public getAllOnlineUsers(){
        return this.onlineUsers;
    }
    
    async broadcastMessageToUsers(usersIds: string[], eventEmitterFunction: (user: Socket, userId: string) => void){
        for(let userId of usersIds){
            if(this.onlineUsers.has(userId)){
                eventEmitterFunction(this.onlineUsers.get(userId), userId);
            } 
        }
    }
    async markUserOnline(userId: string, userSocket: Socket){
        const user = await this.getUser(userId);
        if(!user){
            return CustomError("user not found");
        }
        this.onlineUsers.set(userId, userSocket);
        this.broadcastMessageToUsers(user.friendsIds, sendFriendConnectedEvent);
        return SimpleResponseMessage("success");
    }
    
    async disconnectUser(userId: string){
        this.onlineUsers.delete(userId);
        const user = await this.getUser(userId);
        if(!user){
            return CustomError("user not found");
        }
        this.broadcastMessageToUsers(user.friendsIds, sendFriendDisconnedEvent);
    } 

    async getUserActiveFriends(userId: string){
        const user = await this.getUser(userId);
        if(!user){
            return CustomError("user not found");
        }
        return user.friendsIds.filter(id => this.onlineUsers.has(id));
    }    
}
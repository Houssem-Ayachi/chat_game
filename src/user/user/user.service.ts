import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FilteredUser, User, UserDocument } from 'src/Schemas/user.schema';
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
    
    public async getUsers(ids: string[]){
        return await this.userModel.find({_id: {$in: ids}})
        .select({"_id": true, "userName": true, "character": true}) as FilteredUser[];
    }

    async markUserOnline(userId: string, userSocket: Socket){
        let user = await this.getUser(userId);
        if(!user){
            return CustomError("user not found");
        }
        let filteredUser = new FilteredUser(user);
        this.onlineUsers.set(userId, userSocket);
        //broadcasting message
        for(let userId of user.friendsIds){
            if(this.onlineUsers.has(userId)){
                sendFriendConnectedEvent(this.onlineUsers.get(userId), filteredUser);
            }
        }
        return SimpleResponseMessage("success");
    }
    
    async disconnectUser(userId: string){
        this.onlineUsers.delete(userId);
        const user = await this.getUser(userId);
        if(!user){
            return CustomError("user not found");
        }
        let filteredUser = new FilteredUser(user);
        //broadcasting message
        for(let userId of user.friendsIds){
            if(this.onlineUsers.has(userId)){
                sendFriendDisconnedEvent(this.onlineUsers.get(userId), filteredUser);
            }
        }
    }

    async getUserActiveFriends(userId: string, onlyIds?: boolean){
        const user = await this.getUser(userId);
        if(!user){
            return CustomError("user not found");
        }
        if(onlyIds){
            return user.friendsIds.filter(id => this.onlineUsers.has(id));
        }
        return await this.getUsers(user.friendsIds.filter(id => this.onlineUsers.has(id)));
    }
}
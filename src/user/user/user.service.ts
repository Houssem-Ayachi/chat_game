import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {User, UserDocument} from 'src/Schemas/user.schema';
import { SignUpOBJ } from 'src/auth/auth.dto';
import { UpdateCharacterDTO, UpdateProfileDTO } from '../user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ){}
 
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
}
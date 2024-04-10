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
 
    async findUserByName(name: string, userId: string){
        const id: Types.ObjectId = new Types.ObjectId(userId);
        const users = await this.userModel.find(
            {userName: {$regex: name, $options: "i"},
            _id: {$ne: id}
        })
        .select({"_id": true, "userName": true, "character": true});
        return users;
    }

    async getUser(id: string){
        const user = await this.userModel.findById(id);
        if(user == null){
            throw new BadRequestException("user doesn't exist");
        }
        return user;
    }

    async addUser(signupObj: SignUpOBJ){
        return await this.userModel.create({...signupObj});
    }

    async removeUser(id: string){

    }

    async updateProfile(updateUserDTO: UpdateProfileDTO, userId: string){
        let {bio, funFacts, userName} = updateUserDTO;
        const _id: Types.ObjectId = new Types.ObjectId(userId);
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

    async updateCharacter(updateCharacterDTO: UpdateCharacterDTO, userId: string){
        let {hat, head} = updateCharacterDTO;
        const _id: Types.ObjectId = new Types.ObjectId(userId);
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
}
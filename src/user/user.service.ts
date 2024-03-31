import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {User, UserDocument} from 'src/Schemas/user.schema';
import { SignUpOBJ } from 'src/auth/auth.dto';
import { UpdateCharacterDTO } from './user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ){}
 
    async getUser(id: string){
        
    }

    async addUser(signupObj: SignUpOBJ){
        return await this.userModel.create({...signupObj});
    }

    async removeUser(id: string){

    }

    async updateUser(){

    }

    async updateCharacter(updateCharacterDTO: UpdateCharacterDTO){
        let {id, hat, head, body} = updateCharacterDTO;
        if(!isValidObjectId(id)){
            throw new BadRequestException("id is invalid");
        }
        const user = await this.userModel.findById(id);
        if(user == null){
            throw new BadRequestException("user doesn't exist");
        }
        const ack = await this.userModel.updateOne({_id: user._id}, {character: {hat, head, body}});
        if(ack.modifiedCount == 1){
            return {response: "success"};
        }
        throw new BadRequestException("coulnd't update character");
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

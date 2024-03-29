import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User, UserDocument} from 'src/Schemas/user.schema';
import { SignUpOBJ } from 'src/auth/auth.dto';

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

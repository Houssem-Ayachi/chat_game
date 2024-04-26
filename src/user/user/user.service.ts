import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FilteredUser, User, UserDocument } from 'src/Schemas/user.schema';
import { SignUpOBJ } from 'src/auth/auth.dto';
import { UpdateCharacterDTO, UpdateProfileDTO } from '../user.dto';
import { Socket } from 'net';
import { sendFriendConnectedEvent, sendFriendDisconnedEvent, sendLeveledUpEvent} from './userEvents';
import { CustomError } from 'src/globals/Errors';
import { SimpleResponseMessage } from 'src/globals/Responses';
import { LevelService } from 'src/level/level.service';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly levelService: LevelService,
    ){}
 
    //user's id mapped to his socket instance
    onlineUsers: Map<string, Socket> = new Map();

    //  --------------------ROUTE FUNCTIONS--------------------

    async findUserByName(name: string, id: Types.ObjectId){
        const users = await this.userModel.find(
            {userName: {$regex: name, $options: "i"},
            _id: {$ne: id}
        })
        .select({"_id": true, "userName": true, "character": true});
        return users;
    }

    async getUserProfile(userId: string){
        const user = await this.userModel.findById(userId)
        .populate("level")
        .select({
            userName: true,
            bio: true, 
            funFacts: true, 
            email: true, 
            character: true,
            level: true,
            points: true,
        });
        if(!user){
            throw new BadRequestException("user doens't exist");
        }
        return user;
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
        .select({
            "_id": true,
            "userName": true,
            "character": true,
            "level": true,
            "currentXp": true,
            "points": true
        });
        if(user == null){
            throw new BadRequestException("user doesn't exist");
        }
        return user;
    }

    async addUser(signupObj: SignUpOBJ){
        const level = await this.levelService.getLevelByRank(1);
        return await this.userModel.create({...signupObj, level: level._id});
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

    //  --------------------HELPER FUNCTIONS--------------------

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
    
    public async getUserActiveFriendsIds(userId: string){
        const user = await this.getUser(userId);
        return user.friendsIds.filter(id => this.onlineUsers.has(id));
    }

    public async addExperience(amount: number, userId: string){
        const {level, currentXp, points} = await this.userModel.findById(userId)
        .select({level: true,currentXp: true, points: true})
        .populate("level");
        let newXp = amount + currentXp  
        if(newXp >= level.xpCeiling){ // LEVELED UP
            const nextLevel = await this.levelService.getNextLevel(level.rank); // returns null if maximum level is reached
            if(nextLevel != null){
                await this.userModel.updateOne({_id: userId}, {
                    currentXp: level.xpCeiling % currentXp,
                    level: nextLevel._id,
                    points: points + 10, //with every levelup 10 points are added 
                });
                sendLeveledUpEvent(this.onlineUsers.get(userId));
            }
        }else{ //increment current xp with amount
            await this.userModel.updateOne({_id: userId}, {currentXp: newXp});
        }
    }

    //  --------------------GATEWAY FUNCTIONS--------------------

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

}
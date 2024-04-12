import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Chat, ChatDocument, MessageObj } from 'src/Schemas/chat.schema';
import { UserService } from 'src/user/user/user.service';
import { CreateMessageDTO } from './chat.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
        private readonly userService: UserService
    ){}

    async getMessages(chatId: string){
        if(!isValidObjectId(chatId)){
            throw new WsException("bad chad id");
        }
        const chat = await this.chatModel.findById(chatId);
        const messages = [];
        for(let message of chat.messages){
            const user = await this.userService.getFilteredUser(message.senderId);
            const {senderId, ...msg} = message;
            messages.push({user, ...msg});
        }
        return messages;
    }

    async createChat(usersIds: string[]){
        const chat = await this.chatModel.create({chatters: usersIds});
        return {chatId: chat._id.toString()};
    }

    async getChat(user1Id: string, user2Id: string){
        const chat = await this.chatModel.findOne({chatters: {$in: [user1Id, user2Id]}})
        .select({"_id": true});
        return {chatId: chat._id.toString()};
    }

    async addMessage(createMessageDTO: CreateMessageDTO, userId: string){
        if(!isValidObjectId(createMessageDTO.chatId)){
            throw new WsException("bad chad id");
        }
        const chat = await this.chatModel.findById(createMessageDTO.chatId);
        if(!chat){
            throw new WsException("no chat exists");
        }
        const message: MessageObj = new MessageObj(
            userId,
            createMessageDTO.chatId,
            createMessageDTO.message,
            createMessageDTO.sticker
        );
        chat.messages.push(message);
        return await this.chatModel.updateOne({_id: chat._id}, {messages: chat.messages});
    }

    //NOTE: this function does not work well with group chats caus at the point of making it
    //I wasn't sure whether i'd implement group chats or not
    //TODO: get the last message in the chat and add it to the obj below
    async getActiveChats(userId: string){
        const user = await this.userService.getUser(userId);
        const chats = await this.chatModel.find({
            _id: {$in: user.activeChats.map(id => new Types.ObjectId(id.toString()))}
        });
        const activeChats = [];
        for(let chat of chats){
            const obj = {
                chatId: chat._id.toString(),
                user: await this.userService.getFilteredUser(chat.chatters.filter(user => user.toString() != userId)[0].toString())
            }
            activeChats.push(obj);
        }
        return activeChats;
    }

    async deleteChat(chatId: string, userId: string){
        //check if user actually is part of this chat;
        const chat = await this.chatModel.findById(chatId);
        if(!chat.chatters.includes(userId)){
            throw new ForbiddenException("user not part of chat");
        }
        //for all users inside the chat delete this chat's id from their list of activeChats
        for(let chatterId of chat.chatters){
            await this.userService.removeChatFromUser(chatId, chatterId.toString());
        }
        const _id = new Types.ObjectId(chatId);
        return await this.chatModel.deleteOne({_id});
    }

    async muteChat(){

    }

    async unmuteChat(){

    }

    async blockChat(){

    }

    async unblockChat(){

    }
}

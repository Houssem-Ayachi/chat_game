import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Chat, ChatDocument, PlainMessageObj, OnlineChatObj, Message } from 'src/Schemas/chat.schema';
import { UserService } from 'src/user/user/user.service';
import { CreateMessageDTO } from './chat.dto';
import { WsException } from '@nestjs/websockets';
import { CustomError } from 'src/globals/Errors';
import { sendMessageEvent } from 'src/user/user/userEvents';

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
        const messages: Message[] = [];
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

    async getChatInfo(user1Id: string, user2Id: string){
        const chat = await this.chatModel.findOne({chatters: {$all: [user1Id, user2Id]}})
        .select({"_id": true});
        return {chatId: chat._id.toString()};
    }

    async addMessage(createMessageDTO: CreateMessageDTO, userId: string){
        if(!isValidObjectId(createMessageDTO.chatId)){
            return CustomError("chatId invalid");
        }
        const chat = await this.chatModel.findById(createMessageDTO.chatId);
        if(!chat){
            return CustomError("chat doesn't exist");
        }
        //creating the message
        const message: PlainMessageObj = new PlainMessageObj(
            userId,
            createMessageDTO.chatId,
            createMessageDTO.message,
            createMessageDTO.sticker
        );
        //save message
        chat.messages.push(message);
        await this.chatModel.updateOne({_id: chat._id}, {messages: chat.messages});
        //broadCast message to this chat users "chatters"
        this.sendMessageNotificationToChatters(chat, message);
        this.userService.addExperience(10, userId);
    }

    //NOTE: this method sends to all the chatters other than the sender (works with group chats)
    private async sendMessageNotificationToChatters(chat: ChatDocument, message: PlainMessageObj){
        const chatters = chat.chatters;
        const onlineUsers = this.userService.getAllOnlineUsers();
        const sender = await this.userService.getFilteredUser(message.senderId);
        const msg: Message = {user: sender, chatId: message.chatId, content: message.content, sticker: message.sticker};
        for(let chatter of chatters){
            if(onlineUsers.has(chatter.toString())){
                sendMessageEvent(onlineUsers.get(chatter.toString()), msg);
            }
        }
    }

    //NOTE: this function does not work well with group chats caus at the point of making it
    //I wasn't sure whether i'd implement group chats or not
    async getActiveChats(userId: string){
        const user = await this.userService.getUser(userId);
        const chats = await this.chatModel.find({
            _id: {$in: user.activeChats.map(id => new Types.ObjectId(id.toString()))}
        });
        const activeChats = [];
        for(let chat of chats){
            const obj = {
                chatId: chat._id.toString(),
                lastMessage: chat.messages[chat.messages.length-1],
                user: await this.userService.getFilteredUser(chat.chatters.filter(user => user.toString() != userId)[0].toString())
            }
            activeChats.push(obj);
        }
        return activeChats;
    }

    async getOnlineChats(userId: string){
        const onlineFriends = await this.userService.getUserActiveFriendsIds(userId);
        const onlineChats: ChatDocument[] = [];
        for(let friend of onlineFriends){
            onlineChats.push(await this.chatModel.findOne({chatters: {$all: [userId, friend]}}));
        }
        const res: OnlineChatObj[] = [];
        for(let chat of onlineChats){
            const friendId = chat.chatters.filter(id => id != userId)[0].toString();
            const friend = await this.userService.getFilteredUser(friendId);
            res.push({_id: chat._id.toString(), friend: friend});
        }
        return res;
    }

    async getOnlineChat(userId: string, friendId: string){
        const friend = await this.userService.getFilteredUser(friendId);
        const chat = await this.chatModel.findOne({chatters: {$in: [userId, friendId]}})
        const onlineChatObj: OnlineChatObj = {_id: chat._id.toString(), friend};
        return onlineChatObj;
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

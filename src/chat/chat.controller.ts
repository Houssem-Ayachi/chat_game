import { BadRequestException, Body, Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatInReqDTO } from './chat.dto';
import { ChatService } from './chat.service';
import { isValidObjectId } from "mongoose";
import { UserInsideRequest } from 'src/globals/UserInsideRequest';
import { IsLoggedIn } from 'src/guards/isLoggedIn';
import { IsVerified } from 'src/guards/isVerified';

@UseGuards(IsLoggedIn, IsVerified)
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ){}

    @Get("/messages/:chatId")
    async getMessages(@Param("chatId") chatId: string){
        return await this.chatService.getMessages(chatId);
    }

    @Get("/active")
    async getActiveChats(@Req() req: any){
        const user: UserInsideRequest = req["user"];
        return await this.chatService.getActiveChats(user.userId.toString());
    }

    @Get("/friend/:friendId")
    async getFriendChat(@Param("friendId") friendId: string, @Req() req: any){
        const user: UserInsideRequest = req["user"];
        return await this.chatService.getOnlineChat(user.userId.toString(), friendId);
    }

    @Delete('/')
    async deleteChat(@Body() chatReqBody: ChatInReqDTO, @Req() req: any){
        if(!isValidObjectId(chatReqBody.chatId)){
            throw new BadRequestException("invalid id");
        }
        const userInReqObj: UserInsideRequest = req["user"];
        return await this.chatService.deleteChat(chatReqBody.chatId, userInReqObj.userId.toString());
    }

    @Get("/")
    async chatSettings(){
        
    }

}

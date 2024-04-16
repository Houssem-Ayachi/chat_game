import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket } from 'net';
import { Req, UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/isLoggedIn';
import { IsVerified } from 'src/guards/isVerified';
import { CreateMessageDTO } from './chat.dto';
import { UserInsideRequest } from 'src/globals/UserInsideRequest';

@UseGuards(IsLoggedIn, IsVerified)
@WebSocketGateway({transports: ['websocket']})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService
  ){}

  async handleConnection(client: Socket){

  }

  @SubscribeMessage("onlineChats")
  async getOnlineFriends(@Req() req: any){
      const user: UserInsideRequest = req["user"];
      return await this.chatService.getOnlineChats(user.userId.toString());
  }

  @SubscribeMessage("sendMessage")
  async sendMessage(@MessageBody() createMessageDTO: CreateMessageDTO, @Req() req: any){
    const user: UserInsideRequest = req["user"];
    return await this.chatService.addMessage(createMessageDTO, user.userId.toString());
  }
}
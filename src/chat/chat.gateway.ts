import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'net';
import { Req, UseGuards } from '@nestjs/common';
import { IsLoggedIn } from 'src/guards/isLoggedIn';
import { IsVerified } from 'src/guards/isVerified';
import { } from "@nestjs/platform-socket.io";
import { CreateMessageDTO } from './chat.dto';
import { UserInsideRequest } from 'src/globalTypes/UserInsideRequest';

@UseGuards(IsLoggedIn, IsVerified)
@WebSocketGateway({transports: ['websocket']})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService
  ){}

  @WebSocketServer()
  server: Server;

  //called when a client connects
  async handleConnection(client: Socket){

  }

  async handleDisconnect(client: Socket){

  }

  @SubscribeMessage('message')
  async handleMessage(payload: any, @Req() req: any) {
    return 'Hello world!';
  }

  @SubscribeMessage("sendMessage")
  async sendMessage(@MessageBody() createMessageDTO: CreateMessageDTO, @Req() req: any){
    const user: UserInsideRequest = req["user"];
    return await this.chatService.addMessage(createMessageDTO, user.userId.toString());
  }
}
import { Req, UseGuards } from "@nestjs/common";
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "http";
import { Socket } from "net";
import { UserInsideRequest } from "src/globals/UserInsideRequest";
import { UserService } from "./user.service";
import { IsLoggedIn } from "src/guards/isLoggedIn";
import { IsVerified } from "src/guards/isVerified";
import { CustomError } from "src/globals/Errors";

@UseGuards(IsLoggedIn, IsVerified)
@WebSocketGateway({transports: ['websocket']})
export class UserGateway{
    
    constructor(
        private readonly userService: UserService,
    ){}

    @WebSocketServer()
    server: Server;

    //called when a client connects
    async handleConnection(client: Socket){
        console.log("connected");
    }

    async handleDisconnect(client: Socket, @Req() req: any){
        this.userService.disconnectUser(client["userId"]);
    }

    @SubscribeMessage("register")
    async register(@ConnectedSocket() client: Socket, @Req() req: any){
        const user: UserInsideRequest = req["user"];
        if(client["userId"] != undefined){
            return CustomError("already registered");
        }
        client["userId"] = user.userId.toString();
        this.userService.markUserOnline(user.userId.toString(), client);
        return {message: "success"};
    }

    @SubscribeMessage('message')
    async handleMessage(payload: any, @Req() req: any) {
        return 'Hello world!';
    }
}
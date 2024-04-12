import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Socket } from 'net';
import { UserInsideRequest } from 'src/globalTypes/UserInsideRequest';
import { UserService } from 'src/user/user/user.service';

@Injectable()
export class IsLoggedIn implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly config: ConfigService
    ){}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if(request["headers"]){//http request
            return await this.handleHttpReq(request);
        }else if(request["handshake"]){//ws message
            const client = context.switchToWs().getClient();
            return await this.handleWsReq(request, client);
        }
        
    }

    async handleHttpReq(request: any){
        const token = this.extractToken(request.headers);
        if(token == "") throw new UnauthorizedException();
        try{
            //sub here is the user's id inside the token
            const {sub} = await this.jwtService.verifyAsync(token, {
                secret: this.config.get("JWT_SECRET")
            });
            return await this.verifyUser(sub, request);
        }catch(e){
            throw new UnauthorizedException();
        }
    }

    async handleWsReq(request: any, client: Socket){
        const token = this.extractToken(request.handshake.headers);
        if(token == "") {
            client.emit("error", JSON.stringify({error: "no token"}));
            return;
        }
        try{
            //sub here is the user's id inside the token
            const {sub} = await this.jwtService.verifyAsync(token, {
                secret: this.config.get("JWT_SECRET")
            });
            return await this.verifyUser(sub, request);
        }catch(e){
            client.emit("error", JSON.stringify({error: "token verification error"}));
        }
    }

    extractToken(headers: any): string{
        if(headers["authorization"] == undefined) return "";
        if(headers["authorization"].indexOf("Bearer") == -1) return "";
        const splittedHeaders = headers["authorization"].split(" ");
        return splittedHeaders[1];
    }

    async verifyUser(id: string, request: any): Promise<boolean>{
        if(!Types.ObjectId.isValid(id)){
            return false;
        }
        const user = await this.userService.getUser(id);
        if (user != null){
            request["user"] = new UserInsideRequest(id, user.isVerified)
            return true;
        }
        return false;
    }
}
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Socket } from 'dgram';
import { UserInsideRequest } from 'src/globals/UserInsideRequest';
import { UserService } from 'src/user/user/user.service';

//NOTE: only use this guard after the isLoggedIn guard
//      because the latter pushes the user's isVerified property into the request obj
@Injectable()
export class IsVerified implements CanActivate {

    constructor(){}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user: UserInsideRequest = request["user"] as UserInsideRequest;
        if(!user.isVerified){
            if(request["handshake"]){//ws connection
                const client: Socket = context.switchToWs().getClient();
                client.emit("error", JSON.stringify({error: "not verified"}));
            }else{
                throw new ForbiddenException("email not verified");
            }
        }
        return true;
    }
}


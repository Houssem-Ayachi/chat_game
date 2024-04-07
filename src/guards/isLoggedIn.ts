import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Types } from 'mongoose';

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
            request["userId"] = user._id.toString();
            request["isVerified"] = user.isVerified;
            return true;
        }
        return false;
    }
}


import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

//NOTE: only use this guard after the isLoggedIn guard
//      because the latter pushes the user's isVerified property into the request obj
@Injectable()
export class IsVerified implements CanActivate {

    constructor(
        private readonly userService: UserService,
    ){}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isVerified = request["isVerified"];
        if(!isVerified){
            throw new ForbiddenException("email not verified");
        }
        return true;
    }
}


import { Body, Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
import { IsLoggedIn } from "src/guards/isLoggedIn";
import { IsVerified } from "src/guards/isVerified";
import { AddFriendDTO } from "../user.dto";
import { FriendService } from "./friend.service";
import { UserInsideRequest } from "src/globals/UserInsideRequest";

@UseGuards(IsLoggedIn, IsVerified)
@Controller('friend')
export class FriendController{
    constructor(
        private readonly friendService: FriendService
    ){}

    @Post("/")
    async addFriend(@Body() addFriendObj: AddFriendDTO, @Req() req: any){
        const user: UserInsideRequest = req["user"] as UserInsideRequest;
        return await this.friendService.addFriend(addFriendObj, user.userId.toString());
    }

    @Get("/")
    async getFriends(@Req() req: any){
        const user: UserInsideRequest = req["user"] as UserInsideRequest;
        return await this.friendService.getFriends(user.userId.toString());
    }

    @Delete("/")
    async unfriend(@Body() friendObj: AddFriendDTO, @Req() req: any){
        const user: UserInsideRequest = req["user"] as UserInsideRequest;
        return await this.friendService.unfriend(friendObj, user.userId.toString());
    }
}
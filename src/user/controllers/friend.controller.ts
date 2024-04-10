import { Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { IsLoggedIn } from "src/guards/isLoggedIn";
import { IsVerified } from "src/guards/isVerified";

//TODO: FINISH THOSE METHODS

@UseGuards(IsLoggedIn, IsVerified)
@Controller('friend')
export class FriendController{

    //TODO: add wanted friend to this user's friends list
    //      add this user to the friend's friends list
    @Post("/")
    async addFriend(){

    }

    @Delete("/delete/:id")
    async deleteFriend(@Param("id") id: string){

    }

    @Put("/block/:id")
    async blockFriend(@Param("id") id: string){

    }

    @Put("/ublock/:id")
    async unblockFriend(@Param("id") id: string){

    }

    @Put("/mute/:id")
    async muteFriend(@Param("id") id: string){

    }

    @Put("/unmute/:id")
    async unmuteFriend(@Param("id") id: string){

    }

}
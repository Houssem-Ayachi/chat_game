import { Body, Controller, Delete, Get, Param, Put, Req, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateCharacterDTO, UpdateProfileDTO } from '../user.dto';
import { IsLoggedIn } from 'src/guards/isLoggedIn';
import { IsVerified } from 'src/guards/isVerified';
import { UserInsideRequest } from 'src/globals/UserInsideRequest';

@UseGuards(IsLoggedIn, IsVerified)
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ){}

    @Get("/profile")
    async getUserProfile(@Req() req: any){
        const user: UserInsideRequest = req["user"];
        return await this.userService.getUserProfile(user.userId.toString());
    }

    @Get("/get/:id")
    async getUser(@Param('id') id: string){
        return await this.userService.getUser(id);
    }

    @Get("/search/:userName")
    async findUserByName(@Param("userName") userName: string, @Req() req: any){
        const user: UserInsideRequest = req["user"] as UserInsideRequest;
        return await this.userService.findUserByName(userName, user.userId);
    }

    @Delete("/user")
    async removeUser(){

    }

    @Put("/profile")
    async updateProfile(@Body() updateUserDTO: UpdateProfileDTO, @Request() req: any){
        const user: UserInsideRequest = req["user"] as UserInsideRequest;
        return await this.userService.updateProfile(updateUserDTO, user.userId);
    }

    @Put("/character")
    async updateUserCharacter(@Body() updateCharacterDTO: UpdateCharacterDTO, @Request() req: any){
        const user: UserInsideRequest = req["user"] as UserInsideRequest;
        return await this.userService.updateCharacter(updateCharacterDTO, user.userId);
    }
}
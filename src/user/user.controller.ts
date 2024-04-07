import { Body, Controller, Delete, Get, Param, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateCharacterDTO, UpdateProfileDTO } from './user.dto';
import { IsLoggedIn } from 'src/guards/isLoggedIn';
import { IsVerified } from 'src/guards/isVerified';

//TODO: add email verification guard (IsVerified)

@UseGuards(IsLoggedIn, IsVerified)
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get("/:id")
    async getUser(@Param('id') id: string){
        return await this.userService.getUser(id);
    }

    @Delete("/user")
    async removeUser(){

    }

    @Put("/profile")
    async updateProfile(@Body() updateUserDTO: UpdateProfileDTO, @Request() req: any){
        return await this.userService.updateProfile(updateUserDTO, req["userId"]);
    }

    @Put("/character")
    async updateUserCharacter(@Body() updateCharacterDTO: UpdateCharacterDTO, @Request() req: any){
        return await this.userService.updateCharacter(updateCharacterDTO, req["userId"]);
    }
}
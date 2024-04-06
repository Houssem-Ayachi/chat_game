import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateCharacterDTO, UpdateProfileDTO } from './user.dto';

//TODO: add authentication guard (IsLoggedIn)
//TODO: add email verification guard (IsVerified)

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get("/user/{id}")
    async getUser(@Param('id') id: string){

    }

    @Delete("/user")
    async removeUser(){

    }

    @Put("/profile")
    async updateProfile(@Body() updateUserDTO: UpdateProfileDTO){
        return await this.userService.updateProfile(updateUserDTO);
    }

    @Put("/character")
    async updateUserCharacter(@Body() updateCharacterDTO: UpdateCharacterDTO){
        return await this.userService.updateCharacter(updateCharacterDTO);
    }
}
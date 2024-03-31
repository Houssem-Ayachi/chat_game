import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateCharacterDTO, UpdateUserDTO } from './user.dto';

//TODO: add authentication guard (IsLoggedIn)
//TODO: add email verified guard (IsVerified)

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get("/user/{id}")
    async getUser(@Param('id') id: string){

    }

    @Delete("/user")
    async removeUser(){

    }

    @Put("/user")
    async updateUser(@Body() updateUserDTO: UpdateUserDTO){

    }

    @Put("/character")
    async updateUserCharacter(@Body() updateCharacterDTO: UpdateCharacterDTO){
        return await this.userService.updateCharacter(updateCharacterDTO);
    }
}
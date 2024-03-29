import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateCharacterDTO, UpdateUserDTO } from './user.dto';

//TODO: add authentication guards (IsLoggedIn)

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get("/user/{id}")
    async getUser(@Param('id') id: string){

    }

    @Post("/user")
    async addUser(@Body() createUserDTO: CreateUserDTO){

    }

    @Delete("/user")
    async removeUser(){

    }

    @Put("/user")
    async updateUser(@Body() updateUserDTO: UpdateUserDTO){

    }

    @Put("/user/character")
    async updateUserCharacter(@Body() updateCharacterDTO: UpdateCharacterDTO){

    }
}

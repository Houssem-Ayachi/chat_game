import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UserInsideRequest } from 'src/globals/UserInsideRequest';
import { IsLoggedIn } from 'src/guards/isLoggedIn';
import { IsVerified } from 'src/guards/isVerified';
import { StoreService } from './store.service';
import { StickerToBuy } from './store.dto';

@UseGuards(IsLoggedIn, IsVerified)
@Controller('store')
export class StoreController {

    constructor(private readonly storeService: StoreService){}
 
    @Get("/init")
    async initStickers(){
        await this.storeService.initStickers();
    }

    @Get("/")
    async getAvailableStickers(@Request() req: any){
        const user: UserInsideRequest = req["user"];
        return await this.storeService.getAvailableStickers(user.userId.toString());
    }

    @Post("/buy")
    async buySticker(@Request() req: any, @Body() sticketToBuy: StickerToBuy){
        const user: UserInsideRequest = req["user"];
        await this.storeService.buySticker(user.userId.toString(), sticketToBuy.stickerId);
        return {response: "success"};
    }

}
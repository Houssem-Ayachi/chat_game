import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sticker, StickerDocument } from 'src/Schemas/sticker.schema';
import { UserService } from 'src/user/user/user.service';

@Injectable()
export class StoreService {

    constructor(
        private readonly userService: UserService,
        @InjectModel(Sticker.name) private readonly stickerModel: Model<StickerDocument>
    ){}

    async initStickers(){
        await this.stickerModel.create({imageId: `sticker${10}`, price: 10*5});
    }

    async getAvailableStickers(userId: string){
        const user = await this.userService.getUser(userId) as any;// enables dark magic
        const stickers = await this.stickerModel.find({_id: {$nin: user.storage}}); // dark magic here
        const availableStickers = [];
        for(let sticker of stickers){
            if(!user.storage.includes(sticker)){
                availableStickers.push(sticker);
            }
        }
        return availableStickers;
    }

    async buySticker(userId: string, stickerName: string){
        const user = await this.userService.getUser(userId);
        const sticker = await this.stickerModel.findOne({imageId: stickerName});
        if(sticker == null){
            throw new NotFoundException("sticker not found");
        }
        if((user.storage as any).includes(sticker._id)){
            throw new BadRequestException("sticker already bought");
        }
        if(user.points < sticker.price){
            throw new BadRequestException("not enough points");
        }
        //NOTE: this method is not tested
        return await user.updateOne({storage: [sticker._id.toString(), ...user.storage], points: user.points - sticker.price});
    }

}
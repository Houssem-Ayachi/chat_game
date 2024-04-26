import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level, LevelDocument, LevelType } from 'src/Schemas/level.schema';

@Injectable()
export class LevelService {

    constructor(
        @InjectModel(Level.name) private readonly  levelModel: Model<LevelDocument>,
    ){}

    levels: LevelType[] = [
        {rank: 1, xpCeiling: 25},        
        {rank: 2, xpCeiling: 50},        
        {rank: 3, xpCeiling: 75},        
        {rank: 4, xpCeiling: 100},        
        {rank: 5, xpCeiling: 125},        
        {rank: 6, xpCeiling: 150},        
    ]

    async inializeLevels(){
        for(let level of this.levels){
            await this.levelModel.create({...level});
        }
    }

    async resetLevelsCollection(){
        return await this.levelModel.deleteMany();
    }

    //  --------------------HELPER FUNCTIONS--------------------
    
    public async getLevel(levelId: string){
        return await this.levelModel.findById(levelId);
    }

    public async getNextLevel(currentRank: number){
        if((currentRank) < this.levels.length){
           return await this.levelModel.findOne({rank: currentRank+1});
        }
        return null;
    }

    public async getLevelByRank(rank: number){
        return await this.levelModel.findOne({rank});
    }

}

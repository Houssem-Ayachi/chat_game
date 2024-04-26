import { Controller, Post } from '@nestjs/common';
import { LevelService } from './level.service';

//NOTE: this controller is made only for debugging and testing purposes and should not be implemented in the frontend

@Controller('level')
export class LevelController {

    constructor(private readonly LevelService: LevelService){}

    @Post("/init")
    async initializeLevels(){
        return this.LevelService.inializeLevels();
    }

    @Post("/resetCollection")
    async resetCollection(){
        return this.LevelService.resetLevelsCollection();
    }

}

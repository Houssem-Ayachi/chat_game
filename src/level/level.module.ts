import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { MongooseModule } from '@nestjs/mongoose';
import features from 'src/db/features';

@Module({
  imports: [MongooseModule.forFeature(features)],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService]
})
export class LevelModule {}

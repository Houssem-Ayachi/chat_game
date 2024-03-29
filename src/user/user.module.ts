import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import features from 'src/db/features';

@Module({
  imports: [MongooseModule.forFeature(features)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

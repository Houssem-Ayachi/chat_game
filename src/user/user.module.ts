import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import features from 'src/db/features';
import { FriendController } from './friend/friend.controller';
import { FriendService } from './friend/friend.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [MongooseModule.forFeature(features),
    forwardRef(() => ChatModule)
  ],
  controllers: [UserController, FriendController],
  providers: [UserService, FriendService],
  exports: [UserService]
})
export class UserModule {}
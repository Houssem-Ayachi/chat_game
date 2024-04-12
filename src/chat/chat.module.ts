import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import features from 'src/db/features';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [MongooseModule.forFeature(features),
    forwardRef(() => UserModule)
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}

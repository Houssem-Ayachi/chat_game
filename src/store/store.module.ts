import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import features from 'src/db/features';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature(features),
  ],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}

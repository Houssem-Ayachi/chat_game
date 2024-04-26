import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailerModule } from './emailer/emailer.module';
import { ChatModule } from './chat/chat.module';
import { LevelController } from './level/level.controller';
import { LevelModule } from './level/level.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(new ConfigService().get("DATABASE_URL"), {dbName: "chatGame"}),
    UserModule,
    AuthModule,
    EmailerModule,
    ChatModule,
    LevelModule,
    StoreModule,
  ],
  controllers: [AppController, LevelController],
  providers: [AppService],
})
export class AppModule {};
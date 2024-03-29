import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailerModule } from 'src/emailer/emailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature(),
    UserModule,
    EmailerModule,
    JwtModule.register({
      global: true,
      secret: new ConfigService().get("JWT_SECRET"),
    })
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}

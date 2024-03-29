import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule
  ],
  providers: [EmailerService,],
  exports: [EmailerService]
})
export class EmailerModule {}

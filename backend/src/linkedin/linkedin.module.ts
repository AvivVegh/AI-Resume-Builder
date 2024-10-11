import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { LinkedinController } from './linkedin.controller';
import { LinkedinService } from './linkedin.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [LinkedinController],
  providers: [LinkedinService],
})
export class LinkedinModule {}

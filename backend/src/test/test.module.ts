import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [TestController],
  providers: [TestService, Logger],
})
export class TestModule {}

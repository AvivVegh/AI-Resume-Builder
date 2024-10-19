import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { ConfigService } from '../config/configuration';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, Logger, ConfigService],
  exports: [UserService],
})
export class UserModule {}

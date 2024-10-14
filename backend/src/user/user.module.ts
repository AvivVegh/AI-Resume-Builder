import { Logger, Module } from '@nestjs/common';

import { loadConfigModule } from '../config/configuration';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [loadConfigModule()],
  controllers: [UserController],
  providers: [UserService, UserRepository, Logger],
  exports: [UserService],
})
export class UserModule {}

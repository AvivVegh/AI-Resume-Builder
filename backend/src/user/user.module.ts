import { Logger, Module } from '@nestjs/common';

import { loadConfigModule } from '../config/configuration';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [loadConfigModule()],
  providers: [UserService, UserRepository, Logger],
  exports: [UserService],
})
export class UserModule {}

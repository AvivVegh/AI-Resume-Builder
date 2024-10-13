import { Logger, Module } from '@nestjs/common';

import { loadConfigModule } from '../config/configuration';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [loadConfigModule(), TypeOrmModule],
  providers: [UserService, UserRepository, Logger],
  exports: [UserService],
})
export class UserModule {}

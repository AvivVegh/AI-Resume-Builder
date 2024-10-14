import { Controller, Get, Req } from '@nestjs/common';

import { UserService } from './user.service';
import { Request } from 'express';
import { COOKIE_ID_TOKEN } from '../auth/auth.service';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async profile(@Req() request: Request): Promise<UserEntity> {
    const idToken = request.cookies[COOKIE_ID_TOKEN];
    const user = await this.userService.getUser(idToken);
    return user;
  }
}

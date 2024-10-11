import { Controller, Get, Query } from '@nestjs/common';

import { GetProfileDto } from './dto/get-profile.dto';
import { LinkedinService } from './linkedin.service';

@Controller('linkedin')
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}

  @Get('profile')
  async profile(@Query() dto: GetProfileDto) {
    return await this.linkedinService.getProfile(dto);
  }
}

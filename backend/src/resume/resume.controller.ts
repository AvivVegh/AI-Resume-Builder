import { Controller, Get } from '@nestjs/common';

import { ResumeService } from './resume.service';
import { ConfigService } from '@nestjs/config';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('')
  async loginWithGoogle() {}
}

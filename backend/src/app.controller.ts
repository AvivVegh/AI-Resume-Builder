import { Controller, Get, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('profile')
  async profile() {
    return await this.appService.getProfile();
  }

  @Get('auth/linkedin')
  loginWithLinkedin(@Res() res) {
    res.redirect(this.appService.getRedirectUrl());
  }

  @Get('auth/linkedin/callback')
  async linkedinCallback(@Request() req, @Res() res: Response) {
    const code = req.query.code;
    // TOOD: handle success and errors
    await this.appService.accessToken({ res, code });

    res.redirect('http://localhost:3000');
  }
}

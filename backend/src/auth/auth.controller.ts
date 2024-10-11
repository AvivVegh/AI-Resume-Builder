import { Controller, Get, Request, Res } from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async loginWithGoogle(@Res() res, @Request() req) {
    const cookies = req.cookies;
    const refreshToken = cookies['res-access-token'];
    const accessToken = cookies['res-access-token'];

    if (accessToken) {
      return res.redirect('http://localhost:3000');
    }

    if (refreshToken) {
      try {
        await this.authService.gAccessToken({ res, refreshToken });
        res.redirect('http://localhost:3000');
      } catch (e) {
        console.error(e, 'cannot refresh token');
      }
    }

    res.redirect(this.authService.getGoogleRedirectUrl());
  }

  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const code = req.query.code;
    // TOOD: handle success and errors
    await this.authService.gAccessToken({ res, code });

    res.redirect('http://localhost:3000');
  }
}

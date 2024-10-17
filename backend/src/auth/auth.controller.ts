import { Controller, Get, Request, Res } from '@nestjs/common';

import { Response } from 'express';
import {
  AuthService,
  COOKIE_ACCESS_TOKEN,
  COOKIE_IS_AUTHENTICATED,
  COOKIE_REFRESH_TOKEN,
} from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  clientUrl: string;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.clientUrl = this.configService.get('client.url');
  }

  @Get('google')
  async loginWithGoogle(@Res() res, @Request() req) {
    const cookies = req.cookies;
    try {
      const refreshToken = cookies[COOKIE_REFRESH_TOKEN];
      const accessToken = cookies[COOKIE_ACCESS_TOKEN];
      const isAuthenticated = cookies[COOKIE_IS_AUTHENTICATED];

      if (isAuthenticated && accessToken) {
        return res.redirect(this.clientUrl);
      }

      if (isAuthenticated && refreshToken) {
        try {
          await this.authService.gAccessToken({ res, refreshToken });
          res.redirect(this.clientUrl);
        } catch (e) {
          console.error(e, 'cannot refresh token');
        }
      }
    } catch (e) {
      console.error(e, 'cannot get cookies');
    }

    res.redirect(this.authService.getGoogleRedirectUrl());
  }

  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const code = req.query.code;
    // TOOD: handle success and errors
    await this.authService.gAccessToken({ res, code });
    res.redirect(this.clientUrl);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.authService.logout(res);
    res.redirect(this.clientUrl);
  }
}

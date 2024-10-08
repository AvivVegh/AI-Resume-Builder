import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CookieOptions, Response } from 'express';
import { LinkedInProfileScraper } from 'linkedin-profile-scraper';

const COOKIE_TOKEN = 'res-access-token';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getRedirectUrl(): string {
    const scopes = ['profile', 'openid', 'email', 'w_member_social'].join(
      '%20',
    );

    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&redirect_uri=${this.configService.get(
      'auth.linkedin.callback_url',
    )}&scope=${scopes}&client_id=${this.configService.get(
      'auth.linkedin.client_id',
    )}`;
  }

  async accessToken({
    res,
    code,
  }: {
    res: Response;
    code: string;
  }): Promise<any> {
    try {
      const result = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        {
          code,
          redirect_uri: this.configService.get('auth.linkedin.callback_url'),
          client_id: this.configService.get('auth.linkedin.client_id'),
          client_secret: this.configService.get('auth.linkedin.client_secret'),
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.saveAccessTokenInCookie({
        accessToken: result.data.access_token,
        expiration: result.data.expires_in,
        res,
      });

      return result.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getProfile() {
    console.log('getProfile');
    const accessToken = '';
    const scraper = new LinkedInProfileScraper({
      sessionCookieValue: accessToken,
      keepAlive: false,
    });

    await scraper.setup();

    const result = await scraper.run('https://www.linkedin.com/in/aviv-vegh/');

    console.log(result);

    return result;
  }

  saveAccessTokenInCookie({
    res,
    accessToken,
    expiration,
  }: {
    res: Response;
    accessToken: string;
    expiration: number;
  }) {
    const cookieSettings = this.cookieSettings(expiration);
    res.cookie(COOKIE_TOKEN, accessToken, cookieSettings);
  }

  cookieSettings(exp: number = 0): CookieOptions {
    const date = new Date();
    date.setTime(date.getTime() + exp * 1000);
    return {
      sameSite: 'lax',
      expires: date,
      httpOnly: false,
      domain: this.configService.get('http.host'),
      secure: false,
    };
  }
}

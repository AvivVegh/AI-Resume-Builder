import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CookieOptions, Response } from 'express';

const COOKIE_ACCESS_TOKEN = 'res-access-token';
const COOKIE_REFRESH_TOKEN = 'res-refresh-token';
const COOKIE_ID_TOKEN = 'res-id-token';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getGoogleRedirectUrl(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get(
      'auth.google.client_id',
    )}&redirect_uri=${this.configService.get(
      'auth.google.callback_url',
    )}&response_type=code&scope=profile email openid&prompt=consent&access_type=offline`;
  }

  async gAccessToken({
    res,
    code,
    refreshToken,
  }: {
    res: Response;
    code?: string;
    refreshToken?: string;
  }): Promise<any> {
    try {
      const params = {
        redirect_uri: this.configService.get('auth.google.callback_url'),
        client_id: this.configService.get('auth.google.client_id'),
        client_secret: this.configService.get('auth.google.client_secret'),
      };

      if (code) {
        params['code'] = code;
        params['grant_type'] = 'authorization_code';
      } else {
        params['refresh_token'] = refreshToken;
        params['grant_type'] = 'refresh_token';
      }
      const result = await axios.post(
        'https://oauth2.googleapis.com/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.saveTokensInCookie({
        accessToken: result.data.access_token,
        idToken: result.data.id_token,
        refreshToken: result.data.refresh_token,
        expiration: result.data.expires_in,
        res,
      });

      return result.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  saveTokensInCookie({
    res,
    accessToken,
    refreshToken,
    idToken,
    expiration,
  }: {
    res: Response;
    accessToken: string;
    refreshToken?: string;
    idToken: string;
    expiration: number;
  }) {
    const cookieSettings = this.cookieSettings(expiration);
    if (refreshToken) {
      res.cookie(
        COOKIE_REFRESH_TOKEN,
        refreshToken,
        this.cookieSettings(
          this.configService.get('auth.token_expiration.refresh'),
        ),
      );
    }
    if (idToken) {
      res.cookie(COOKIE_ID_TOKEN, idToken, cookieSettings);
    }
    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, cookieSettings);
  }

  cookieSettings(exp: number = 0): CookieOptions {
    const date = new Date();
    date.setTime(date.getTime() + exp * 1000);
    return {
      sameSite: 'lax',
      expires: date,
      httpOnly: true,
      domain: this.configService.get('http.host'),
      secure: true,
    };
  }
}

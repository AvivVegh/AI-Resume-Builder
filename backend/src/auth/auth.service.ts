import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CookieOptions, Response } from 'express';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/configuration';

export const COOKIE_ACCESS_TOKEN = 'res-access-token';
export const COOKIE_REFRESH_TOKEN = 'res-refresh-token';
export const COOKIE_ID_TOKEN = 'res-id-token';
export const COOKIE_IS_AUTHENTICATED = 'res-is-authenticated';

@Injectable()
export class AuthService {
  configService = new ConfigService();
  baseUrl: string;
  callbackUrl: string;
  clientId: string;
  clientSecret: string;
  tokenExpiration: number;
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    this.baseUrl = this.configService.get('http_host');
    this.callbackUrl = `${this.configService.get(
      'google_callback_base_url',
    )}/${this.configService.get('google_callback_path')}`;
    this.clientId = this.configService.get('google_client_id');
    this.clientSecret = this.configService.get('google_client_secret');
    this.tokenExpiration = this.configService.get('refresh_token_expiration');
  }

  getGoogleRedirectUrl(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.configService.get(
      'google_client_id',
    )}&redirect_uri=${this.callbackUrl}&response_type=code&scope=profile email openid&prompt=consent&access_type=offline`;
  }

  logout(res: Response) {
    res.clearCookie(COOKIE_ACCESS_TOKEN);
    res.clearCookie(COOKIE_REFRESH_TOKEN);
    res.clearCookie(COOKIE_ID_TOKEN);
    res.clearCookie(COOKIE_IS_AUTHENTICATED);
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
      this.logger.log('get access token user token', { code, refreshToken });
      const params = {
        redirect_uri: this.callbackUrl,
        client_id: this.clientId,
        client_secret: this.clientSecret,
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

      this.logger.log('get access token user token success');

      const userInfoResult = await axios.post(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${result.data.id_token}`,
      );

      this.logger.log('get access token user info success');

      const userInfo = userInfoResult.data;

      await this.userService.createUser({
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        providerId: userInfo.sub,
        providerType: 'google',
      });

      this.saveTokensInCookie({
        accessToken: result.data.access_token,
        idToken: result.data.id_token,
        refreshToken: result.data.refresh_token,
        expiration: result.data.expires_in,
        res,
      });

      this.logger.log('save tokens in cookie success');

      return result.data;
    } catch (e) {
      this.logger.error(e, 'get access token user token error');
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
    const cookieSettings = this.cookieSettings({
      exp: expiration,
      secure: false,
    });

    const secureCookieSettings = this.cookieSettings({
      exp: expiration,
      secure: true,
    });

    res.cookie(COOKIE_IS_AUTHENTICATED, 'true', cookieSettings);

    if (refreshToken) {
      res.cookie(
        COOKIE_REFRESH_TOKEN,
        refreshToken,
        this.cookieSettings({ exp: this.tokenExpiration, secure: true }),
      );
    }

    if (idToken) {
      res.cookie(COOKIE_ID_TOKEN, idToken, secureCookieSettings);
    }

    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, secureCookieSettings);
  }

  cookieSettings({
    secure,
    exp = 0,
  }: {
    exp: number;
    secure: boolean;
  }): CookieOptions {
    const date = new Date();
    date.setTime(date.getTime() + exp * 1000);
    return {
      sameSite: 'lax',
      expires: date,
      httpOnly: secure,
      domain: this.baseUrl,
      secure: secure,
    };
  }
}

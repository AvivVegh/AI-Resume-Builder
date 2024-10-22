import axios from 'axios';
// import { UserService } from '../user/user.service';
import { getConfig } from '../lib/configuration';
import { Logger } from '../lib/logger';
import { RequestContext } from '../lib/request-context';

export const COOKIE_ACCESS_TOKEN = 'res-access-token';
export const COOKIE_REFRESH_TOKEN = 'res-refresh-token';
export const COOKIE_ID_TOKEN = 'res-id-token';
export const COOKIE_IS_AUTHENTICATED = 'res-is-authenticated';

export class AuthService {
  clientBaseUrl: string;
  callbackUrl: string;
  clientId: string;
  clientSecret: string;
  tokenExpiration: number;
  constructor(
    // private userService: UserService,
    private logger: Logger
  ) {
    this.clientBaseUrl = getConfig('client_base_url');
    this.callbackUrl = `${getConfig('google_callback_base_url')}/${getConfig('google_callback_path')}`;
    this.clientId = getConfig('google_client_id');
    this.clientSecret = getConfig('google_client_secret');
    this.tokenExpiration = parseInt(getConfig('refresh_token_expiration'));
  }

  getGoogleRedirectUrl(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${getConfig(
      'google_client_id'
    )}&redirect_uri=${this.callbackUrl}&response_type=code&scope=profile email openid&prompt=consent&access_type=offline`;
  }

  logout() {
    const context = RequestContext.getInstance();
    context.clearCookie(COOKIE_ACCESS_TOKEN);
    context.clearCookie(COOKIE_REFRESH_TOKEN);
    context.clearCookie(COOKIE_ID_TOKEN);
    context.clearCookie(COOKIE_IS_AUTHENTICATED);
  }

  async gAccessToken({ code, refreshToken }: { code?: string; refreshToken?: string }): Promise<any> {
    try {
      this.logger.info('get access token user token', { code, refreshToken });
      const params = {
        redirect_uri: this.callbackUrl,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      } as any;

      if (code) {
        params['code'] = code;
        params['grant_type'] = 'authorization_code';
      } else {
        params['refresh_token'] = refreshToken;
        params['grant_type'] = 'refresh_token';
      }

      let result;
      try {
        result = await axios.post('https://oauth2.googleapis.com/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } catch (e) {
        this.logger.error(e, 'get access token user token error');
        return null;
      }

      this.logger.info('get access token user token success');

      const userInfoResult = await axios.post(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${result.data.id_token}`
      );

      this.logger.info('get access token user info success');

      const userInfo = userInfoResult.data;

      // await this.userService.createUser({
      //   email: userInfo.email,
      //   firstName: userInfo.given_name,
      //   lastName: userInfo.family_name,
      //   providerId: userInfo.sub,
      //   providerType: 'google',
      // });

      this.saveTokensInCookie({
        accessToken: result.data.access_token,
        idToken: result.data.id_token,
        refreshToken: result.data.refresh_token,
        expiration: result.data.expires_in,
      });

      this.logger.info('save tokens in cookie success');

      return result.data;
    } catch (e) {
      this.logger.error(e, 'get access token user token error');
      return null;
    }
  }

  saveTokensInCookie({
    accessToken,
    refreshToken,
    idToken,
    expiration,
  }: {
    accessToken: string;
    refreshToken?: string;
    idToken: string;
    expiration: number;
  }) {
    const context = RequestContext.getInstance();
    const cookieSettings = this.cookieSettings({
      exp: expiration,
      secure: false,
    });

    const secureCookieSettings = this.cookieSettings({
      exp: expiration,
      secure: true,
    });

    context.setCookie(COOKIE_IS_AUTHENTICATED, 'true', cookieSettings);

    if (refreshToken) {
      context.setCookie(
        COOKIE_REFRESH_TOKEN,
        refreshToken,
        this.cookieSettings({ exp: this.tokenExpiration, secure: true })
      );
    }

    if (idToken) {
      context.setCookie(COOKIE_ID_TOKEN, idToken, secureCookieSettings);
    }

    context.setCookie(COOKIE_ACCESS_TOKEN, accessToken, secureCookieSettings);
  }

  cookieSettings({ secure, exp = 0 }: { exp: number; secure: boolean }) {
    const date = new Date();
    date.setTime(date.getTime() + exp * 1000);
    return {
      sameSite: 'lax',
      expires: date,
      httpOnly: secure,
      domain: this.clientBaseUrl,
      secure: secure,
    };
  }
}

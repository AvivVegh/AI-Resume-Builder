import axios from 'axios';

import { TokenResultDto } from './token-result.dto';

import { getConfig } from '../lib/configuration';
import { Logger } from '../lib/logger';
import { UserService } from '../user/user.service';

export const PARAM_ACCESS_TOKEN = 'access-token';
export const PARAM_REFRESH_TOKEN = 'refresh-token';
export const PARAM_ID_TOKEN = 'id-token';
export const PARAM_IS_AUTHENTICATED = 'is-authenticated';

export class AuthService {
  clientBaseUrl: string;
  callbackUrl: string;
  clientId: string;
  clientSecret: string;
  tokenExpiration: number;
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {
    this.clientBaseUrl = getConfig('client_base_url');
    this.callbackUrl = `${getConfig('google_callback_base_url')}/${getConfig('google_callback_path')}`;
    this.clientId = getConfig('google_client_id');
    this.clientSecret = getConfig('google_client_secret');
    this.tokenExpiration = parseInt(getConfig('refresh_token_expiration'));
  }

  async createUser({
    email,
    firstName,
    lastName,
    providerId,
    providerType,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    providerId: string;
    providerType: string;
  }) {
    await this.userService.createUser({ email, firstName, lastName, providerId, providerType });
  }

  getGoogleRedirectUrl(): string {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${getConfig(
      'google_client_id'
    )}&redirect_uri=${this.callbackUrl}&response_type=code&scope=profile email openid&prompt=consent&access_type=offline`;

    this.logger.debug('get google redirect url', url);

    return url;
  }

  logout() {
    // TOOD: implement logout
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

      const user = await this.userService.createUser({
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        providerId: userInfo.sub,
        providerType: 'google',
      });

      this.logger.info('save tokens in cookie success');

      return {
        accessToken: result.data.access_token,
        idToken: result.data.id_token,
        refreshToken: result.data.refresh_token,
        userId: user.id,
      } as TokenResultDto;
    } catch (e) {
      this.logger.error(e, 'get access token user token error');
      return null;
    }
  }
}

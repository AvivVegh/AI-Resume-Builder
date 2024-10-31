import { APIGatewayEvent, Context } from 'aws-lambda';

import 'reflect-metadata';
import { AuthService, PARAM_ACCESS_TOKEN, PARAM_IS_AUTHENTICATED, PARAM_REFRESH_TOKEN } from './auth.service';

import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { Logger } from '../lib/logger';
import { RequestContext } from '../lib/request-context';
import { getConfig } from '../lib/configuration';
import { UserService } from '../user/user.service';
import { UserRepository, UserRepositoryType } from '../repositories/user.repository';

export const paths = ['google', '/google/callback', 'logout'];

export const googleCallback = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const logger = myContainer.resolve(Logger);

  logger.debug('google callback started');

  const clientUrl = getConfig('client_url');

  const code = event.queryStringParameters.code;
  const refresh = event.queryStringParameters.refresh;

  const repository = myContainer.get<UserRepository>(UserRepositoryType);
  const userService = new UserService(repository, logger);

  const authService = new AuthService(userService, logger);

  const result = await authService.gAccessToken({ code, refreshToken: refresh });
  const url = `${clientUrl}?access_token=${result.accessToken}&refresh_token=${result.refreshToken}&id_token=${result.idToken}`;
  logger.debug('google callback ended');

  return {
    statusCode: 302,
    data: url,
  };
});

export const loginWithGoogle = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const logger = myContainer.resolve(Logger);

  logger.debug('login started');

  const clientUrl = getConfig('client_url');

  const repository = myContainer.get<UserRepository>(UserRepositoryType);
  const userService = new UserService(repository, logger);

  const authService = new AuthService(userService, logger);

  try {
    const refreshToken = event.pathParameters[PARAM_REFRESH_TOKEN];
    const accessToken = event.pathParameters[PARAM_ACCESS_TOKEN];
    const isAuthenticated = event.pathParameters[PARAM_IS_AUTHENTICATED];

    if (isAuthenticated && accessToken) {
      logger.debug('login - user is authenticated');

      return {
        statusCode: 302,
        data: clientUrl,
      };
    }

    if (isAuthenticated && refreshToken) {
      logger.debug('login - user is not authenticated refresh token');

      try {
        const result = await authService.gAccessToken({ refreshToken });
        const url = `${clientUrl}?access_token=${result.accessToken}&refresh_token=${result.refreshToken}&id_token=${result.idToken}`;
        return {
          statusCode: 302,
          data: url,
        };
      } catch (e) {
        logger.error(e, 'cannot refresh token');
      }
    }
  } catch (e) {
    logger.error(e, 'cannot get cookies');
  }

  logger.debug('login - user is not authenticated get redirect url');

  return {
    statusCode: 302,
    data: authService.getGoogleRedirectUrl(),
  };
});

export const logout = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const clientUrl = getConfig('client_url');

  const logger = myContainer.resolve(Logger);

  const repository = myContainer.get<UserRepository>(UserRepositoryType);
  const userService = new UserService(repository, logger);

  const authService = new AuthService(userService, logger);

  await authService.logout();

  return {
    statusCode: 302,
    data: clientUrl,
  };
});

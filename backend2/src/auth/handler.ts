import { APIGatewayEvent, Context } from 'aws-lambda';
import 'reflect-metadata';
import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { Logger } from '../lib/logger';
import { RequestContext } from '../lib/request-context';
import { getConfig } from '../lib/configuration';
import { AuthService, COOKIE_ACCESS_TOKEN, COOKIE_IS_AUTHENTICATED, COOKIE_REFRESH_TOKEN } from './auth.service';
import { UserService } from '../user/user.service';
import { UserRepository, UserRepositoryType } from '../repositories/user.repository';
import { HttpResponses } from '../lib/http-responses';

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
  const requestContext = RequestContext.getInstance();

  const repository = myContainer.get<UserRepository>(UserRepositoryType);
  const userService = new UserService(repository, logger);

  const authService = new AuthService(userService, logger);

  try {
    const refreshToken = requestContext.getCookie(COOKIE_REFRESH_TOKEN);
    const accessToken = requestContext.getCookie(COOKIE_ACCESS_TOKEN);
    const isAuthenticated = requestContext.getCookie(COOKIE_IS_AUTHENTICATED);

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

export const test = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const clientUrl = getConfig('client_url');

  const logger = myContainer.resolve(Logger);

  const repository = myContainer.get<UserRepository>(UserRepositoryType);
  const userService = new UserService(repository, logger);

  const authService = new AuthService(userService, logger);

  await authService.createUser({
    email: 'foo@gmail.com',
    firstName: 'foo',
    lastName: 'bar',
    providerId: '123',
    providerType: 'google',
  });

  return HttpResponses.DATA_RESPONSE({}, 1);
});

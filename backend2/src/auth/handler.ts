import { APIGatewayEvent, Context } from 'aws-lambda';
import 'reflect-metadata';
import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { Logger } from '../lib/logger';
import { RequestContext } from '../lib/request-context';
import { getConfig } from '../lib/configuration';
import { AuthService, COOKIE_ACCESS_TOKEN, COOKIE_IS_AUTHENTICATED, COOKIE_REFRESH_TOKEN } from './auth.service';
import { HttpResponses } from '../lib/http-responses';

export const paths = ['google', '/google/callback', 'logout'];

export const test = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  return HttpResponses.DATA_RESPONSE({ a: 'test' });
});

export const googleCallback = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const clientUrl = getConfig('client_url');

  const code = event.queryStringParameters.code;
  const refresh = event.queryStringParameters.refresh;

  const logger = myContainer.resolve(Logger);

  const authService = new AuthService(logger);

  await authService.gAccessToken({ code, refreshToken: refresh });

  return {
    statusCode: 302,
    data: clientUrl,
  };
});

export const loginWithGoogle = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const clientUrl = getConfig('client_url');
  const requestContext = RequestContext.getInstance();
  const logger = myContainer.resolve(Logger);
  const authService = new AuthService(logger);

  try {
    const refreshToken = requestContext.getCookie(COOKIE_REFRESH_TOKEN);
    const accessToken = requestContext.getCookie(COOKIE_ACCESS_TOKEN);
    const isAuthenticated = requestContext.getCookie(COOKIE_IS_AUTHENTICATED);

    if (isAuthenticated && accessToken) {
      return {
        statusCode: 302,
        data: clientUrl,
      };
    }

    if (isAuthenticated && refreshToken) {
      try {
        await authService.gAccessToken({ refreshToken });
        return {
          statusCode: 302,
          data: clientUrl,
        };
      } catch (e) {
        logger.error(e, 'cannot refresh token');
      }
    }
  } catch (e) {
    logger.error(e, 'cannot get cookies');
  }

  return {
    statusCode: 302,
    data: authService.getGoogleRedirectUrl(),
  };
});

export const logout = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const clientUrl = getConfig('client_url');

  const logger = myContainer.resolve(Logger);

  const authService = new AuthService(logger);

  await authService.logout();

  return {
    statusCode: 302,
    data: clientUrl,
  };
});

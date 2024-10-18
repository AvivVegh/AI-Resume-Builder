import { APIGatewayEvent, Context } from 'aws-lambda';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';

import { Logger } from '../lib/logger';

import { myContainer } from '../inversify.config';
import { COOKIE_ACCESS_TOKEN, COOKIE_IS_AUTHENTICATED, COOKIE_REFRESH_TOKEN } from './auth.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

export const paths = ['/assets/delete-folder'];

export const handler = handlerWrapper(
  async (event: APIGatewayEvent, context: Context) => {
    const httpMethod =
      event.requestContext['httpMethod'] ||
      (event.requestContext as any)?.http?.method;

    switch (httpMethod) {
      case 'POST': {
        const logger = myContainer.resolve(Logger);

        const service = new DeleteFolderService({
          assetsRepository,
          foldersRepository,
          logger,
          bitlyService,
        });
        return await deleteFolder(service, getDeleteFolderRequest(event, user));
      }
    }
  },
);

export const loginWithGoogle = handlerWrapper(
  async (event: APIGatewayEvent, context: Context) => {
    const headers = event.headers ;

    const clientUrl = process.env.CLIENT_URL;
    const configService = new ConfigService()
    const logger = myContainer.resolve(Logger);

    const authService = new AuthService(configService, logger)

  const cookies = headers.cookies as any;
  try {
    const refreshToken = cookies[COOKIE_REFRESH_TOKEN];
    const accessToken = cookies[COOKIE_ACCESS_TOKEN];
    const isAuthenticated = cookies[COOKIE_IS_AUTHENTICATED];

    if (isAuthenticated && accessToken) {
      return {
        statusCode:302, 
        data: clientUrl
      }
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
})

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
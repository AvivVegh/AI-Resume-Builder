import { APIGatewayEvent, Context } from 'aws-lambda';

import 'reflect-metadata';

import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { Logger } from '../lib/logger';
import { HttpResponses } from '../lib/http-responses';
import { RequestContext } from '../lib/request-context';
import { User } from '../types/user';
import { UserService } from '../user/user.service';
import { UserRepository, UserRepositoryType } from '../repositories/user.repository';

export const paths = ['/profile'];

export const getProfile = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const logger = myContainer.resolve(Logger);

  const user = RequestContext.getInstance().get()['user'] as User;

  if (!user) {
    return HttpResponses.ERROR_FORBIDDEN();
  }

  const repository = myContainer.get<UserRepository>(UserRepositoryType);

  const userService = new UserService(repository, logger);

  const userEntity = await userService.getUser(user.id);

  return HttpResponses.DATA_RESPONSE(userEntity);
});

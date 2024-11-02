import { APIGatewayEvent } from 'aws-lambda';

import 'reflect-metadata';

import { OpenAiService } from './open-ai-service';

import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { Logger } from '../lib/logger';
import { HttpResponses } from '../lib/http-responses';
import { UserResumeRepository, UserResumeRepositoryType } from '../repositories/user-resume.repository';
import { RequestContext } from '../lib/request-context';
import { User } from '../types/user';
import { UserRepository, UserRepositoryType } from '../repositories/user.repository';
import { UserService } from '../user/user.service';

export const paths = ['/ai/create-resume'];

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const logger = myContainer.resolve(Logger);

  logger.debug('upload resume started');

  const user = RequestContext.getInstance().get()['user'] as User;

  if (!user) {
    return HttpResponses.ERROR_FORBIDDEN();
  }

  const body = JSON.parse(event.body) as { resume: string; jobDescription: string };
  const resume = body.resume;
  const jobDescription = body.jobDescription;

  const userResumeRepository = myContainer.get<UserResumeRepository>(UserResumeRepositoryType);
  const userRepository = myContainer.get<UserRepository>(UserRepositoryType);
  const userService = new UserService(userRepository, logger);

  const uploadResumeService = new OpenAiService(logger, userResumeRepository, userService);

  const result = await uploadResumeService.generateResume({ userId: user.id, resume, jobDescription });
  logger.debug('upload resume ended', result);

  return HttpResponses.DATA_RESPONSE(result, 0);
});

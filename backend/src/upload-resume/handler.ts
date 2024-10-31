import { APIGatewayEvent, Context } from 'aws-lambda';

import 'reflect-metadata';
import { UploadResumeService } from './upload-resume.service';

import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { Logger } from '../lib/logger';
import { HttpResponses } from '../lib/http-responses';

export const paths = ['upload-resume'];

export const uploadResume = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const logger = myContainer.resolve(Logger);

  logger.debug('upload resume started');

  const uploadResumeService = new UploadResumeService(logger);

  const result = await uploadResumeService.generateResume({ jobDescription: 'job description', resume: 'resume' });
  logger.debug('upload resume ended');

  return HttpResponses.DATA_RESPONSE({}, 0);
});

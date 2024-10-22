import { APIGatewayEvent, Context } from 'aws-lambda';
import { myContainer } from '../inversify.config';
import { handlerWrapper } from '../lib/handler-helpers/wrapper';
import { HttpResponses } from '../lib/http-responses';
import { RequestContext } from '../lib/request-context';
import { User } from '../types/user';
import { uploadFile } from './api';
import { getUploadFileRequest } from './mapper';
import { SaveAssestsService } from './save-asset.service';
import { Logger } from '../lib/logger';
import { AssetsRepository, AssetsRepositoryType } from '../repositories/assets.repository';
import { BitlyService, BitlyServiceType } from '../bitly/bitly.service';

export const paths = ['/assets/save'];

export const handler = handlerWrapper(async (event: APIGatewayEvent, context: Context) => {
  const httpMethod = event.requestContext['httpMethod'] || (event.requestContext as any)?.http?.method;
  const user: User = RequestContext.getInstance().get()['user'];

  if (!user) {
    return HttpResponses.ERROR_FORBIDDEN();
  }

  switch (httpMethod) {
    case 'POST': {
      const logger = myContainer.resolve(Logger);
      const repository = myContainer.get<AssetsRepository>(AssetsRepositoryType);
      const bitlyService = myContainer.get<BitlyService>(BitlyServiceType);

      const service = new SaveAssestsService(logger, repository, bitlyService);

      return await uploadFile(service, getUploadFileRequest(event, /** user.id **/ user));
    }
  }
});

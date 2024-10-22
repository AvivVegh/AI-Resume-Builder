import { APIGatewayEvent } from 'aws-lambda';

import { extractBody, extractQueryParams } from '../lib/request';
import { IUploadFileRequest, uploadFileRequestSchemaKeys } from '../types/asset';
import { User } from '../types/user';

export const getUploadFileRequest = (event: APIGatewayEvent, user: User): IUploadFileRequest => {
  const params = extractQueryParams<IUploadFileRequest>(event, uploadFileRequestSchemaKeys);
  const body = extractBody<IUploadFileRequest>(event, uploadFileRequestSchemaKeys);

  return {
    event,
    userId: user.id,
    userEmail: user.email,
    ...body,
    ...params,
  };
};

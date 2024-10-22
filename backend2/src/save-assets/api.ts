import { myContainer } from '../inversify.config';
import { HttpResponses } from '../lib/http-responses';
import { Logger } from '../lib/logger';
import { IUploadFileRequest, uploadFileRequestSchema } from '../types/asset';
import { SaveAssestsService } from './save-asset.service';

export const uploadFile = async (service: SaveAssestsService, params: IUploadFileRequest) => {
  const { error } = uploadFileRequestSchema.validate(params);

  if (error) {
    return HttpResponses.ERROR_VALIDATION(error);
  }

  const logger = myContainer.resolve(Logger);
  const UPLOAD_FILE = logger.time('Uploading a file');

  try {
    const response = await service.saveAsset(params);

    return HttpResponses.DATA_RESPONSE(response, 1);
  } catch (error) {
    return HttpResponses.ERROR(error);
  } finally {
    logger.timeEnd(UPLOAD_FILE);
  }
};

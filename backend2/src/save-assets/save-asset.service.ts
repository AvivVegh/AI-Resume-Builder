import { BitlyService } from '../bitly/bitly.service';
import { Asset } from '../entities/asset.entity';
import { getConfig } from '../lib/configuration';
import { Logger } from '../lib/logger';
import { AssetsRepository } from '../repositories/assets.repository';
import { IGetAssetsResponseItem, IUploadFileRequest } from '../types/asset';
import { trimFilePath } from '../lib/utils';

export const SaveAssestsServiceType = Symbol.for('SaveAssestsService');

export class SaveAssestsService {
  logger: Logger;
  repository: AssetsRepository;
  bitlyService: BitlyService;

  constructor(logger: Logger, repository: AssetsRepository, bitlyService: BitlyService) {
    this.logger = logger;
    this.repository = repository;
    this.bitlyService = bitlyService;
  }

  async saveAsset(params: IUploadFileRequest): Promise<IGetAssetsResponseItem> {
    this.logger.debug('save assets', params);
    const baseurl = getConfig('AssetsBukcetBaseUrl');

    const filePath = trimFilePath({ filePath: params.filePath });

    const url = `${baseurl}/${filePath}/${params.fileName}`;

    const assetEntity = await this.repository.getAsset({ fileName: params.fileName, filePath });

    console.log('assetEntity', assetEntity);

    let shortLink = assetEntity?.shortUrl;
    let bitlyId;
    if (!assetEntity) {
      const { id, link } = await this.bitlyService.createShortLink({ url });
      shortLink = link;
      bitlyId = id;
    }

    const asset = new Asset();
    asset.fileName = params.fileName;
    asset.contentType = params.fileContentType;
    asset.userEmail = params.userEmail;
    asset.size = params.size;
    asset.shortUrl = shortLink;
    asset.bitlyId = bitlyId;
    asset.url = url;
    asset.filePath = filePath;
    asset.createdAt = new Date();

    let entity = asset;

    if (assetEntity) {
      await this.repository.update(Asset, assetEntity.id, asset);
    } else {
      entity = await this.repository.saveOne(asset);
    }

    return asset;
  }
}

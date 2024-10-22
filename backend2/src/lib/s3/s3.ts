import { S3 } from 'aws-sdk';
import { Asset } from '../../entities/asset.entity';
import { getConfig } from '../configuration';

export const deleteFile = async (key: string) => {
  const bucketName = getConfig('AssetsBucketName');

  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: [
        {
          Key: key,
        },
      ],
    },
  };

  const s3 = new S3();

  await s3.deleteObjects(params).promise();
};

export const deleteFiles = async ({ keys }: { keys: string[] }) => {
  return await Promise.all(keys.map((key) => deleteFile(key)));
};

export const getAssetKey = (asset: Asset) => {
  return `${asset.fileName}`;
};

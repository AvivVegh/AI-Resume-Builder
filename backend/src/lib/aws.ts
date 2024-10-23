import { config } from 'aws-sdk';
import { getConfig } from './configuration';

export const configureAWSConfig = (region?: string) => {
  let awsRegion = region;
  if (!region) {
    awsRegion = getConfig('AwsRegion');
  }

  awsRegion = awsRegion?.trim();

  const accessKeyId = getConfig('AWS_SECRET_ACCESS_KEY');
  const secretAccessKey = getConfig('AWS_ACCESS_KEY_ID');

  const credentials = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  };

  config.update({ credentials: credentials, region: awsRegion });
};

export const updateAwsRegion = (region: string) => {
  config.update({
    region: region,
  });
};

import { SecretsManager } from 'aws-sdk';
import { decode } from 'jsonwebtoken';

import { getRegion } from './utils';

export const verifyToken = (token: string, publicKey?: string): any => {
  return decode(token);
};

export const getSecret = async (secretName: string) => {
  // const logger = myContainer.resolve(Logger);
  const region = getRegion();

  const client = new SecretsManager({
    region: region,
  });

  try {
    // const RETRIEVING_SECRETS = logger.time('Retrieving secrets');

    const response = await client.getSecretValue({ SecretId: secretName }).promise();
    // logger.timeEnd(RETRIEVING_SECRETS);

    if ('SecretString' in response) {
      return response.SecretString;
    } else {
      const buff = Buffer.from(response.SecretBinary.toString(), 'base64');

      return buff.toString('ascii');
    }
  } catch (error) {
    console.error('get secret error', error);
  }
};

export const getTokenPayload = (token: string): any => {
  return decode(token.replace('Bearer', '').trim());
};

import _ = require('lodash');
import { SecretsManager } from 'aws-sdk';

// import { myContainer } from '../inversify.config';

export const getRegion = (): string => process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;

export const getTenantConfigurationSecret = async (tenantId: string) => {
  // const logger = myContainer.resolve(Logger);
  const region = getRegion();
  const { StageName } = process.env;

  const client = new SecretsManager({
    region: region,
  });

  const secretName = `${StageName}_${tenantId}_CONFIG_VARIABLES`.toUpperCase();
  // logger.debug('Retrieving secrets', { tenantId, secretName });

  try {
    // const RETRIEVING_SECRETS = logger.time('Retrieving secrets');

    const response = await client.getSecretValue({ SecretId: secretName }).promise();

    // logger.timeEnd(RETRIEVING_SECRETS);

    if ('SecretString' in response) {
      const secret = response.SecretString;
      // logger.debug('Found secret', { tenantId, secretName, secret });

      return JSON.parse(secret);
    } else {
      const buff = new Buffer(response.SecretBinary.toString(), 'base64');

      const secret = buff.toString('ascii');
      // logger.debug('Found secret', { tenantId, secretName, secret });

      return JSON.parse(secret);
    }
  } catch (error) {
    // logger.error(error, {
    //   message: 'Could not retrieve secrets from Secrets Manager',
    //   location: 'src/lib/utils.ts:getTenantConfigurationSecret()',
    // });
  }
};

export const isNullOrUndefined = (val: any): boolean => {
  return _.isNull(val) || _.isUndefined(val);
};

export const trimFilePath = ({ filePath }: { filePath: string }): string => {
  return filePath?.replace(/ +/g, ' ').replace(/\s\//g, '/').replace(/\/\s/g, '/').trim();
};

export const getFilePath = ({ filePath }: { filePath: string }): string => {
  if (filePath.endsWith('/')) {
    // remove last / from the path
    return filePath.slice(0, -1);
  }

  return filePath;
};

export const getLowercaseHeaders = (headers?: { [key: string]: any }): { [key: string]: any } => {
  if (!headers) {
    return {};
  }
  return Object.keys(headers).reduce((newHeaders: { [key: string]: any }, currHeader) => {
    newHeaders[currHeader.toLowerCase()] = headers[currHeader];
    return newHeaders;
  }, {});
};

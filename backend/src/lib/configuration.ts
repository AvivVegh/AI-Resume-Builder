import fs from 'fs';
import { load } from 'js-yaml';
import _ from 'lodash';
import path from 'path';

export const getConfig = (key: string): string => {
  const STAGE_LOCAL = 'local';
  const STAGE_NAME = process.env.STAGE_NAME ? process.env.STAGE_NAME : STAGE_LOCAL;

  const configurationPath = path.resolve(__dirname, `../../serverless.config.${STAGE_NAME}.yml`);

  let value = process.env[key];

  const useConfiguration = fs.existsSync(configurationPath) && !value;

  if (useConfiguration && STAGE_NAME === 'local') {
    const config = load(fs.readFileSync(configurationPath, 'utf8'));
    value = _.get(config, `environment.${key}`);
  }

  return value;
};

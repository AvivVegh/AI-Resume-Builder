import { ConfigModule } from '@nestjs/config';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { merge } from 'lodash';

const YAML_CONFIG_FILENAME = 'config.yaml';
export const defaultConfig = join(__dirname, YAML_CONFIG_FILENAME);

function handleYAMLError(error: yaml.YAMLException, configFileName: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { message, ...restOfError } = error;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { buffer, snippet, ...restOfMark } = (restOfError as any).mark;
  const errorWithoutPII = {
    ...restOfError,
    mark: restOfMark,
    message: `bad yaml file: ${configFileName}`,
  } as Error;
  throw errorWithoutPII;
}

const loadConfigFile = (
  configFileName = process.env.service_config || defaultConfig,
) => {
  try {
    const yamlRes = yaml.load(readFileSync(configFileName, 'utf8'));
    return yamlRes as Record<string, any>;
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      handleYAMLError(error, configFileName);
    } else {
      throw error;
    }
  }
};

let config = null;

export const loadConfig = (
  configFileName = process.env.service_config || defaultConfig,
) => {
  if (!config) {
    config =
      configFileName === defaultConfig
        ? loadConfigFile(configFileName)
        : merge(loadConfigFile(defaultConfig), loadConfigFile(configFileName));
  }

  const configProxy = new Proxy(config, {
    get: function (target, prop) {
      return config[prop];
    },
  });
  return configProxy;
};

export const loadConfigModule = (
  configFileName = process.env.service_config || defaultConfig,
) => {
  return ConfigModule.forRoot({
    load: [() => loadConfig(configFileName)],
    isGlobal: true,
  });
};

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};

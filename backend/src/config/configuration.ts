import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { merge } from 'lodash';

const YAML_CONFIG_FILENAME = 'config.yaml';
export const defaultConfig = join(__dirname, YAML_CONFIG_FILENAME);

export class ConfigService {
  config: any;
  constructor() {
    this.config = this.loadConfig();
  }

  get(key: string) {
    return this.config[key];
  }

  private handleYAMLError(error: yaml.YAMLException, configFileName: string) {
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

  private loadConfigFile(
    configFileName = process.env.service_config || defaultConfig,
  ) {
    try {
      const yamlRes = yaml.load(readFileSync(configFileName, 'utf8'));
      return yamlRes as Record<string, any>;
    } catch (error) {
      if (error instanceof yaml.YAMLException) {
        this.handleYAMLError(error, configFileName);
      } else {
        throw error;
      }
    }
  }

  private loadConfig(
    configFileName = process.env.service_config || defaultConfig,
  ) {
    if (!this.config) {
      this.config =
        configFileName === defaultConfig
          ? this.loadConfigFile(configFileName)
          : merge(
              this.loadConfigFile(defaultConfig),
              this.loadConfigFile(configFileName),
            );
    }

    const configProxy = new Proxy(this.config, {
      get: function (target, prop) {
        return this.config[prop];
      },
    });
    return configProxy;
  }
}

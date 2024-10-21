// import { config as dotenvConfig } from 'dotenv';

// dotenvConfig({ path: '.env' });

export class ConfigService {
  private readonly envConfig: Record<string, any>;

  constructor() {
    this.envConfig = process.env;
  }

  get(key: string): any {
    const value = this.envConfig[key];
    return value;
  }
}

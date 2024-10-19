export class ConfigService {
  private readonly envConfig: Record<string, any>;

  constructor() {
    this.envConfig = process.env;
  }

  get(key: string): any {
    console.log('key', key);
    const value = this.envConfig[key];
    console.log('value', value);
    return value;
  }
}

export class RequestContext {
  private static _instance: RequestContext;

  public static getInstance() {
    return this._instance || (this._instance = new this());
  }

  private context: any = {};

  public clearAll(): void {
    this.context = {};
  }

  public replaceAllWith(ctx: any): void {
    this.context = ctx;
  }

  public set(key: string, value: any): void {
    if (key.indexOf('x-correlation-') !== 0) {
      key = 'x-correlation-' + key;
    }
    this.context[key] = value;
  }

  public get(): any {
    return this.context;
  }
}

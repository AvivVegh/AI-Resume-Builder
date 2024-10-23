const COOKIES = 'SET-COOKIES';

export class RequestContext {
  private static _instance: RequestContext;

  static getInstance() {
    return this._instance || (this._instance = new this());
  }

  private context: any = {};

  clearAll(): void {
    this.context = {};
  }

  replaceAllWith(ctx: any): void {
    this.context = ctx;
  }

  set(key: string, value: any): void {
    if (key.indexOf('x-correlation-') !== 0) {
      key = 'x-correlation-' + key;
    }
    this.context[key] = value;
  }

  get(): any {
    return this.context;
  }

  setCookie(key: string, value: any, options: any): void {
    this.context[COOKIES] = this.context[COOKIES] || {};
    this.context[COOKIES][key] = {};
    this.context[COOKIES][key]['value'] = value;
    if (options) {
      this.context[COOKIES][key]['options'] = options;
    }
  }

  setCookies(cookies: {}): void {
    this.context[COOKIES] = cookies;
  }

  getCookie(key: string): any {
    if (!this.context[COOKIES]) {
      return null;
    }
    return this.context[COOKIES][key];
  }

  clearCookie(key: string): void {
    if (this.context[COOKIES]) {
      delete this.context[COOKIES][key];
    }
  }

  getCookies(): any {
    return this.context[COOKIES];
  }
}

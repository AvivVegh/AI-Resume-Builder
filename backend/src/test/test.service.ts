import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestService {
  baseUrl;
  constructor(
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.baseUrl = this.configService.get('http.host');
  }

  hello() {
    return 'Hello World!';
  }
}

import { Controller, Get } from '@nestjs/common';

import { TestService } from './test.service';

@Controller('test')
export class TestController {
  clientUrl: string;
  constructor(private readonly service: TestService) {}

  @Get('hello')
  async hello() {
    return this.service.hello();
  }
}

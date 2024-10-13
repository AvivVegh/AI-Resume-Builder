import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResumeService {
  constructor(private configService: ConfigService) {}
}

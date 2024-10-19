import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { ConfigService } from '../config/configuration';

@Module({
  imports: [],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}

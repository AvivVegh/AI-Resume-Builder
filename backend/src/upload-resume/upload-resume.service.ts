import { Logger } from '../lib/logger';
import { UploadResumeRequestDto } from './upload-resume-request.dto';

export class UploadResumeService {
  constructor(private logger: Logger) {}

  async generateResume(dto: UploadResumeRequestDto) {}
}

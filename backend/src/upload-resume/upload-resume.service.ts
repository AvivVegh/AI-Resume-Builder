import { UploadResumeRequestDto } from './upload-resume-request.dto';

import { Logger } from '../lib/logger';

export class UploadResumeService {
  constructor(private logger: Logger) {}

  async generateResume(dto: UploadResumeRequestDto) {}
}

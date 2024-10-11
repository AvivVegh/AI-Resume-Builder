import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LinkedInProfileScraper } from 'linkedin-profile-scraper';
import { GetProfileDto } from './dto/get-profile.dto';

@Injectable()
export class LinkedinService {
  constructor(private configService: ConfigService) {}

  async getProfile(dto: GetProfileDto) {
    const accessToken = this.configService.get('auth.linkedin.cookie');
    let result = null;
    try {
      const scraper = new LinkedInProfileScraper({
        sessionCookieValue: accessToken,
        keepAlive: false,
      });

      await scraper.setup();

      result = await scraper.run(dto.url);
    } catch (error) {
      if (error.name === 'SessionExpired') {
        throw new Error('Invalid session cookie');
      }
      console.log(error);
    }

    return result;
  }
}

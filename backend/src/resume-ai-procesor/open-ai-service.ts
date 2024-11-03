import OpenAI from 'openai';

import { UserResumeRepository } from '../repositories/user-resume.repository';
import { Logger } from '../lib/logger';
import { UserResumeEntity } from '../entities/user-resume.entity';
import { getConfig } from '../lib/configuration';
import { UserService } from '../user/user.service';

const TOKEN_MULT = 0.2;
const MAX_TOKENS = 1000;

export class OpenAiService {
  openAiClient: OpenAI;
  constructor(
    private logger: Logger,
    private userResumeRepository: UserResumeRepository,
    private userService: UserService
  ) {
    const openAiToken = getConfig('openai_api_key');
    this.openAiClient = new OpenAI({
      apiKey: openAiToken,
    });
  }

  async generateResume({ userId, resume, jobDescription }: { userId: string; resume: string; jobDescription: string }) {
    if (resume.length * TOKEN_MULT > MAX_TOKENS) {
      this.logger.error('resume too long', { userId });
      throw new Error('resume too long');
    }

    if (jobDescription && jobDescription.length * TOKEN_MULT > MAX_TOKENS) {
      this.logger.error('job description too long', { userId });
      throw new Error('job description too long');
    }

    this.logger.info('generating resume schema');

    await this.userService.updateUserResume({ userId, resume });

    const completion = await this.openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `
          task description: 
          the main goal is to rewrite the resume in the context.
          Dont add details that exists in jobDescription and not exists in the resume.
          Highlight the information from resume that match the jobDescption.          
          Add details that are exists in the resume and not exists in the jobDescription.
          1. from the resume in the context write a summary like a human would write on himself. 
          2. from the resume in the context extract the full name.
          3. from the resume in the context extract the user job title.
          4. from the resume in the context extract the user linkedin.
          5. from the resume in the context extract the user email.
          6. from the resume in the context extract the user city.
          7. from the resume in the context extract the skills if possible.
          8. from the resume in the context rewrite the user experience, rewrite job details.
          9. from the resume in the context extract the user education if possible.
          10. from the resume in the context extract the user certifications if possible.
          11. from the resume in the context rewrite the user projects if possible do not duplicate content from the experience.
          
          context: 
          jobDescription: ${jobDescription}
          resume: ${resume}          
          response schema:            
          {
              user: { fullName: string, title: string, linkedIn: string, email: string, city: string } 
              summary: string
              skills: string[]
              experience: { company: string, title: string, jobDetails: string, dates: string }[]
              education: string[]
              certifications: string[]
              projects: string[]
          }

          do not include the context in the response. 
          do not include the task description in the response. 
          do not include extra text, do not include backticks.
          do not prompt the user for more information.
        `,
        },
      ],
    });

    if (!completion.choices?.length) {
      this.logger.error('no completion', { userId });
      throw new Error('no completion');
    }

    if (completion.choices[0].message.content.includes('error')) {
      this.logger.error('error in completion', { userId });
      throw new Error('error in completion');
    }

    const responseBody = JSON.parse(completion.choices[0].message.content);

    this.logger.info(responseBody);

    const userResueme = {
      userId,
      resume,
      jobDescription,
    } as UserResumeEntity;

    await this.userResumeRepository.create(userResueme);

    this.logger.info('user resume created', { userId });
    return responseBody;
  }
}

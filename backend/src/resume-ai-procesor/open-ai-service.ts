import OpenAI from 'openai';

import { UserResumeRepository } from '../repositories/user-resume.repository';
import { Logger } from '../lib/logger';
import { UserResumeEntity } from '../entities/user-resume.entity';
import { getConfig } from '../lib/configuration';

const TOKEN_MULT = 0.2;
const MAX_TOKENS = 1000;

export class OpenAiService {
  openAiClient: OpenAI;
  constructor(
    private logger: Logger,
    private userResumeRepository: UserResumeRepository
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

    const completion = await this.openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: `
          task description: 
          the main goal is to rewrite the resume in the context of the job description.
          1. from the resume in the context write a summary like a human would write on himself. 
          2. from the resume in the context extract the skills required for the job.
          3. from the resume in the context rewrite the user experience, rewrite job details.
          4. from the resume in the context extract the user education if possible.
          5. from the resume in the context extract the user certifications if possible.
          6. from the resume in the context rewrite the user projects if possible do not duplicate content from the experience.

          context: 
          1. resume: ${resume}
          2. job description: ${jobDescription}
          response schema:            
          { 
              summary: string
              skills: string[]
              experience: { company: string, position: string, job_details: string, dates: string }[]
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

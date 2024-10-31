import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { UserResumeRepository } from '../repositories/user-resume.repository';
import { Logger } from '../lib/logger';
import { UserResumeEntity } from '../entities/user-resume.entity';
import { getRegion } from '../lib/utils';

const MODEL_ID = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
const TOKEN_MULT = 0.2;
const MAX_TOKENS = 1000;
const AI_TEMP = 0.5;

export class AiService {
  constructor(
    private logger: Logger,
    private userResumeRepository: UserResumeRepository
  ) {}

  async generateResume({ userId, resume, jobDescription }: { userId: string; resume: string; jobDescription: string }) {
    const region = getRegion();
    const runtimeClient = new BedrockRuntimeClient({ region });

    if (resume.length * TOKEN_MULT > MAX_TOKENS) {
      this.logger.error('resume too long', { userId });
      throw new Error('resume too long');
    }

    if (jobDescription && jobDescription.length * TOKEN_MULT > MAX_TOKENS) {
      this.logger.error('job description too long', { userId });
      throw new Error('job description too long');
    }

    this.logger.info('generating resume schema');

    const payload = {
      max_tokens: MAX_TOKENS,
      temperature: AI_TEMP,
      anthropic_version: 'bedrock-2023-05-31',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `
            task description: 
            the main goal is to rewrite the resume in the context of the job description.
            1. from the resume in the context write a summary like a human would write on himself. 
            2. from the resume in the context extract the skills required for the job.
            3. from the resume in the context rewrite the user experience.
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
                experience: string[]
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
        },
      ],
    };

    // Invoke Claude with the payload and wait for the response.
    const command = new InvokeModelCommand({
      contentType: 'application/json',
      accept: '*/*',

      body: JSON.stringify(payload),
      modelId: MODEL_ID,
    });

    const apiResponse = await runtimeClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);

    const responseBody = JSON.parse(decodedResponseBody);

    this.logger.info(responseBody);

    const userResueme = {
      userId,
      resume,
      jobDescription,
    } as UserResumeEntity;

    await this.userResumeRepository.create(userResueme);

    this.logger.info('user resume created', { userId });
    return responseBody.content;
  }
}

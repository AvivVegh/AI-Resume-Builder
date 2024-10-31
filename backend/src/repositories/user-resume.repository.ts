import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { DataService } from './data.service';

import { Database, DatabaseType } from '../lib/database/data-source';
import { UserResumeEntity } from '../entities/user-resume.entity';

export const UserResumeRepositoryType = Symbol.for('UserResumeRepository');

@injectable()
export class UserResumeRepository extends DataService {
  constructor(@inject(DatabaseType) private database: Database) {
    super(database);
  }

  async create(entity: UserResumeEntity): Promise<UserResumeEntity> {
    const insertResult = await this.insert(UserResumeEntity, entity);
    if (insertResult?.raw) {
      return insertResult.raw[0];
    }
    return null;
  }

  async getAll({ userId }: { userId: string }): Promise<UserResumeEntity[]> {
    const query = this.getQueryBuilder(UserResumeEntity, 'user_resumes');
    query
      .select('id')
      .addSelect('resume')
      .addSelect('user_id')
      .addSelect('job_description')
      .where('user_id = :userId', { userId })
      .andWhere('deleted = false');
    return await query.getMany();
  }

  async getById({ id }: { id: string }) {
    const query = this.getQueryBuilder(UserResumeEntity, 'user_resumes');
    query
      .select('id')
      .addSelect('resume')
      .addSelect('user_id')
      .addSelect('resume')
      .addSelect('job_description')
      .where('id = :id', { id });
    return await query.getOne();
  }
}

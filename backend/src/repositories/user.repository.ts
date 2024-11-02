import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { DataService } from './data.service';

import { Database, DatabaseType } from '../lib/database/data-source';
import { UserEntity } from '../entities/user.entity';

export const UserRepositoryType = Symbol.for('UserRepository');

@injectable()
export class UserRepository extends DataService {
  constructor(@inject(DatabaseType) private database: Database) {
    super(database);
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const insertResult = await this.insert(UserEntity, entity);
    if (insertResult?.raw) {
      return insertResult.raw[0];
    }
    return null;
  }

  async getAll() {
    const query = this.getQueryBuilder(UserEntity, 'users');
    query.select('id').addSelect('first_name').addSelect('last_name');
    return await query.getMany();
  }

  async getById({ id }: { id: string }) {
    const query = this.getQueryBuilder(UserEntity, 'users').select().where('id = :id', { id });
    return await query.getOne();
  }

  async getByEmail({ email }: { email: string }): Promise<UserEntity> {
    const query = this.getQueryBuilder(UserEntity, 'users');
    query.where('*').where('email = :email', { email });
    return await query.getOne();
  }
}

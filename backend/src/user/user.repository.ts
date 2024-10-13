import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User as UserEntity } from '../entities/user.entity';
import { loadConfig } from 'src/config/configuration';

@Injectable()
export class UserRepository {
  constructor(
    private readonly logger: Logger,
    @InjectDataSource(loadConfig().database.databasea)
    private readonly dataSource: DataSource,
  ) {}

  manager() {
    return this.dataSource.manager;
  }

  async create(userEntity: UserEntity) {
    try {
      const query = await this.manager()
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values(userEntity)
        .returning('*');

      const result = await query.execute();
      return result.raw[0];
    } catch (err) {
      this.logger.error(err, 'error creating entity');
    }
  }
  async getAll() {
    const query = this.manager().createQueryBuilder(UserEntity, 'user');
    query.select('id').addSelect('firstName').addSelect('lastName');
    return await query.getMany();
  }

  async getById({ id }: { id: string }) {
    const query = this.manager().createQueryBuilder(UserEntity, 'user');
    query
      .select('id')
      .addSelect('firstName')
      .addSelect('lastName')
      .where('id = :id', { id });
    return await query.getOne();
  }
}

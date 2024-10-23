import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  ObjectType,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
  getRepository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Database, DatabaseType } from '../lib/database/data-source';
export const DataServiceType = Symbol.for('DataService');

@injectable()
export class DataService {
  private manager: EntityManager;

  constructor(@inject(DatabaseType) database: Database) {
    this.manager = database.getEnitityManager();
  }

  public async getOneById<TEntity>(
    entityClass: EntityTarget<TEntity>,
    id: string,
    options: FindOptionsWhere<TEntity> = {}
  ): Promise<TEntity> {
    return this.manager.findOneBy(entityClass, { ...options, id });
  }

  public async getOneBy<TEntity>(
    entityClass: EntityTarget<TEntity>,
    options: FindOptionsWhere<TEntity>
  ): Promise<TEntity> {
    return this.manager.findOneBy(entityClass, options);
  }

  public async getOne<TEntity>(entityClass: EntityTarget<TEntity>, options: FindOneOptions<TEntity>): Promise<TEntity> {
    return this.manager.findOne(entityClass, options);
  }

  public async insert<TEntity>(
    entityClass: ObjectType<TEntity>,
    data: QueryDeepPartialEntity<TEntity>
  ): Promise<InsertResult> {
    return this.manager.insert<TEntity>(entityClass, data);
  }

  public async update<TEntity>(
    entityClass: ObjectType<TEntity>,
    id: string,
    data: QueryDeepPartialEntity<TEntity>
  ): Promise<UpdateResult> {
    return this.manager.update<TEntity>(entityClass, id, data);
  }

  public async saveOne<TEntity>(entity: TEntity): Promise<TEntity> {
    return this.manager.save(entity);
  }

  public async deleteOne<TEntity>(entity: TEntity): Promise<TEntity> {
    return this.manager.remove(entity);
  }

  public async getMany<TEntity>(entityClass: ObjectType<TEntity>, options?: FindManyOptions): Promise<TEntity[]> {
    if (options) {
      return this.manager.find(entityClass, options);
    } else {
      return this.manager.find(entityClass);
    }
  }

  public async getManyAndCount<TEntity>(
    entityClass: ObjectType<TEntity>,
    options?: FindManyOptions
  ): Promise<{ items: TEntity[]; totalCount: number }> {
    if (options) {
      const results = await this.manager.findAndCount(entityClass, options);

      return { items: results[0], totalCount: results[1] };
    } else {
      const results = await this.manager.findAndCount(entityClass);

      return { items: results[0], totalCount: results[1] };
    }
  }

  public async saveMany<TEntity>(entities: TEntity[]): Promise<TEntity[]> {
    return this.manager.save(entities);
  }

  public async deleteMany<TEntity>(entities: TEntity[]): Promise<TEntity[]> {
    return this.manager.remove(entities);
  }

  public getQueryBuilder<TEntity>(entityClass: ObjectType<TEntity>, alias: string): SelectQueryBuilder<TEntity> {
    return this.manager.createQueryBuilder(entityClass, alias);
  }

  public getManyByQuery(query: string, params?: any[]): Promise<any[]> {
    return this.manager.query(query, params);
  }

  public getRepository<TEntity>(entityClass: ObjectType<TEntity>): Repository<TEntity> {
    return getRepository(entityClass, this.manager.connection.name);
  }

  public executeRawQuery(query: string, params?: any[]): Promise<any> {
    return this.manager.query(query, params);
  }

  public transaction(cb: (entityManager: EntityManager) => Promise<any>): Promise<any> {
    return this.manager.transaction(cb);
  }
}

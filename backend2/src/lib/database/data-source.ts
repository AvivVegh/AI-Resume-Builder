import { injectable } from 'inversify';
import 'reflect-metadata';
import { DataSource, EntityManager } from 'typeorm';
import { Asset } from '../../entities/asset.entity';
import { getConfig } from '../configuration';
import { migrations } from './migrations';
import { Folder } from '../../entities/folder.entity';

export const DatabaseType = Symbol.for('Database');

@injectable()
export class Database {
  private entityManager: EntityManager;

  constructor() {}

  async closeConnections() {
    const dataSource = await this.getDataSource();
    await dataSource.destroy();
  }

  isDatabaseConnected(): boolean {
    if (!this.entityManager) {
      return false;
    }

    return this.entityManager?.connection?.isInitialized;
  }
  async initEnitityManager(): Promise<void> {
    if (!this.entityManager) {
      const dataSource = await this.getDataSource();
      this.entityManager = dataSource.manager;
    }
  }

  getEnitityManager(): EntityManager {
    return this.entityManager;
  }

  async getDataSource(): Promise<DataSource> {
    const config = getConnetionConfig();
    console.log('config', config);
    return await new DataSource(config).initialize();
  }
}

export const getConnetionConfig = (): any => {
  const databaseUrl = getConfig('DatabaseUrl');

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [Asset, Folder], // where our entities reside
    migrations: migrations, // where our migrations reside
    logging: true,
    synchronize: false,
  };
};

import { injectable } from 'inversify';
import 'reflect-metadata';
import { DataSource, EntityManager } from 'typeorm';

import { User1728793793379 } from './migrations/1728793793379-user.migration';
import { UserResume1730394029773 } from './migrations/1730394029773-user-resume.migration';

import { getConfig } from '../configuration';
import * as entities from '../../entities';

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
  const dbHost = getConfig('db_host');
  const dbPort = getConfig('db_port');
  const dbUsername = getConfig('db_username');
  const dbPassword = getConfig('db_password');
  const dbDatabase = getConfig('db_database');

  return {
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbPassword,
    database: dbDatabase,
    entities: Object.values(entities),
    migrations: [User1728793793379, UserResume1730394029773],
    logging: true,
    synchronize: false,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
};

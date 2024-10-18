import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loadConfig } from './configuration';

dotenvConfig({ path: '.env' });

const config = loadConfig();

export const typeOrmConfig = {
  type: 'postgres',
  host: config.db_host,
  port: config.db_port,
  username: config.db_username,
  password: config.db_password,
  database: config.db_database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: false,
  synchronize: false,
};

export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions,
);

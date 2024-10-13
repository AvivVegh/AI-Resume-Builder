import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loadConfig } from './configuration';

dotenvConfig({ path: '.env' });

const config = loadConfig();

export const typeOrmConfig = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions,
);

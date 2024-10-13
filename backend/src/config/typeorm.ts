import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { loadConfig } from './configuration';

dotenvConfig({ path: '.env' });

const config = loadConfig();

export const typeOrmConfig = {
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: false,
  synchronize: false,
};

export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions,
);

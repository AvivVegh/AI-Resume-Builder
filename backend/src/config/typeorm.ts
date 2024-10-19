import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from './configuration';

const configService = new ConfigService();

export const typeOrmConfig = {
  type: 'postgres',
  host: configService.get('db_host'),
  port: configService.get('db_port'),
  username: configService.get('db_username'),
  password: configService.get('db_password'),
  database: configService.get('db_database'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: false,
  synchronize: false,
};

export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions,
);

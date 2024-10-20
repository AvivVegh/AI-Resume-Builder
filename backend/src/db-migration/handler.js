import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm';

export const handler = async () => {
  const dataSource = new DataSource(typeOrmConfig);

  await dataSource.initialize();

  await dataSource.runMigrations({
    transaction: 'all',
  });

  await dataSource.destroy();

  return {
    statusCode: 200,
    body: JSON.stringify('Running migrations successfully!'),
  };
};

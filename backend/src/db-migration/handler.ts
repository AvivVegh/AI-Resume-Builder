import { APIGatewayEvent, Context } from 'aws-lambda';

import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm';

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const dataSource = new DataSource({ ...typeOrmConfig } as any);

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

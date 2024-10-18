import 'reflect-metadata';
import { myContainer } from '../../inversify.config';
import { Database, DatabaseType } from '../../lib/database/data-source';

export const initEnitityManager = async () => {
  const db = myContainer.get<Database>(DatabaseType);
  await db.initEnitityManager();
};

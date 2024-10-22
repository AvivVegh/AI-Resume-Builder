import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Folder } from '../entities/folder.entity';
import { Database, DatabaseType } from '../lib/database/data-source';
import { DataService } from './data.service';

export const FolderRepositoryType = Symbol.for('FolderRepository');

@injectable()
export class FoldersRepository extends DataService {
  constructor(@inject(DatabaseType) private database: Database) {
    super(database);
  }

  async create(folder: Folder): Promise<Folder> {
    const insertResult = await this.insert(Folder, folder);
    if (insertResult?.raw) {
      return insertResult.raw[0];
    }
    return null;
  }

  async deleteFolder({ userEmail, path }: { path: string; userEmail: string }): Promise<void> {
    const query = this.getQueryBuilder(Folder, 'folder')
      .update<Folder>(Folder, { deleted: true, deleteBy: userEmail })
      .where(`path = :path`, { path })
      .updateEntity(true);

    await query.execute();
  }

  async getFolder({ path }: { path: string }): Promise<Folder> {
    try {
      const query = this.getQueryBuilder(Folder, 'folder')
        .select()
        .where(`path = :path`, { path })
        .andWhere('deleted = false');

      return await query.getOne();
    } catch (error) {
      console.log('error while fetching folder', error);
      return null;
    }
  }

  async getTree(): Promise<Folder[]> {
    try {
      const query = this.getQueryBuilder(Folder, 'folder').select().andWhere('deleted = false').orderBy('path', 'ASC');

      return await query.getMany();
    } catch (error) {
      console.log('error while fetching tree', error);
      return null;
    }
  }
}

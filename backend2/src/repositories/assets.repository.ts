import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Asset } from '../entities/asset.entity';
import { Database, DatabaseType } from '../lib/database/data-source';
import { DataService } from './data.service';
import { Like } from 'typeorm';

export const AssetsRepositoryType = Symbol.for('AssetsRepository');

@injectable()
export class AssetsRepository extends DataService {
  constructor(@inject(DatabaseType) private database: Database) {
    super(database);
  }

  async deleteAsset({ fileName, filePath }: { filePath: string; fileName?: string }): Promise<void> {
    const query = this.getQueryBuilder(Asset, 'assets')
      .delete()
      .where(`file_path like :path`, { path: `%${filePath}%` });
    if (fileName) {
      query.andWhere('file_name = :fileName', { fileName });
    }

    await query.execute();
  }

  async getAsset({ fileName, filePath }: { filePath: string; fileName: string }): Promise<Asset> {
    try {
      const query = this.getQueryBuilder(Asset, 'assets')
        .select()
        .where(`file_path like :path`, { path: `%${filePath}%` })
        .andWhere('file_name = :fileName', { fileName });

      return await query.getOne();
    } catch (error) {
      console.log('error while fetching asset', error);
      return null;
    }
  }

  async getByPath({ path }: { path: string }): Promise<Asset[]> {
    const entities = await this.getMany(Asset, {
      where: { filePath: Like(`%${path}%`) },
    });

    return entities;
  }
}

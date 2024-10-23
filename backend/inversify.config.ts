import { Container } from 'inversify';
import { BitlyService, BitlyServiceType } from './bitly/bitly.service';
import { Database, DatabaseType } from './lib/database/data-source';
import { Logger, LoggerType } from './lib/logger';
import { AssetsRepository, AssetsRepositoryType } from './repositories/assets.repository';
import { DataService, DataServiceType } from './repositories/data.service';
import { FolderRepositoryType, FoldersRepository } from './repositories/folders.repository';

const myContainer = new Container();

myContainer.bind<Database>(DatabaseType).to(Database).inSingletonScope();
myContainer.bind<Logger>(LoggerType).to(Logger).inSingletonScope();
myContainer.bind<BitlyService>(BitlyServiceType).to(BitlyService).inSingletonScope();
myContainer.bind<DataService>(DataServiceType).to(DataService).inSingletonScope();
myContainer.bind<AssetsRepository>(AssetsRepositoryType).to(AssetsRepository).inSingletonScope();
myContainer.bind<FoldersRepository>(FolderRepositoryType).to(FoldersRepository).inSingletonScope();

export { myContainer };

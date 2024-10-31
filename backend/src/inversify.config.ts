import { Container } from 'inversify';

import { Database, DatabaseType } from './lib/database/data-source';
import { Logger, LoggerType } from './lib/logger';
import { DataService, DataServiceType } from './repositories/data.service';
import { UserRepository, UserRepositoryType } from './repositories/user.repository';
import { UserResumeRepository, UserResumeRepositoryType } from './repositories/user-resume.repository';

const myContainer = new Container();

myContainer.bind<Database>(DatabaseType).to(Database).inSingletonScope();
myContainer.bind<Logger>(LoggerType).to(Logger).inSingletonScope();
myContainer.bind<DataService>(DataServiceType).to(DataService).inSingletonScope();
myContainer.bind<UserRepository>(UserRepositoryType).to(UserRepository).inSingletonScope();
myContainer.bind<UserResumeRepository>(UserResumeRepositoryType).to(UserResumeRepository).inSingletonScope();

export { myContainer };

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { loadConfigModule } from './config/configuration';
import { LinkedinModule } from './linkedin/linkedin.module';
import { ResumeModule } from './resume/resume.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm';

@Module({
  imports: [
    loadConfigModule(),
    TypeOrmModule.forRoot({ ...typeOrmConfig } as any),
    AuthModule,
    LinkedinModule,
    ResumeModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

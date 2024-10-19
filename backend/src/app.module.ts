import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm';
import { UserModule } from './user/user.module';
import { ConfigService } from './config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...typeOrmConfig } as any),
    AuthModule,
    ResumeModule,
    UserModule,
  ],

  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}

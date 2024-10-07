import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    // LinkedinAuthModule.forRoot({
    //   clientID: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    //   callbackURL: process.env.CALLBACK_URL,
    //   scope: ['profile', 'email', 'w_member_social', 'openid'],
    // }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

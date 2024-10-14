import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    preflightContinue: false,
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const port = config.get('http.port');
  console.log(`Listening on port ${port}`);
  await app.listen(port);
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
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

  app.useGlobalPipes(new ValidationPipe());

  const port = config.get('http.port');
  console.log(`Listening on port ${port}`);
  await app.listen(port);
}
bootstrap();

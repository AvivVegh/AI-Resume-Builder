import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors();
  const port = config.get('http.port');
  console.log(`Listening on port ${port}`);
  await app.listen(port);
}
bootstrap();

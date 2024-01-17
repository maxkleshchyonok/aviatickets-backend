import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({origin: 'http://localhost:3000'});

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  await app.listen(port, () => console.log(`Server started at port: ${port}`));
}
bootstrap();

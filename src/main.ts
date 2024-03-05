import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ErrorFilter } from './middlewares/error-filter.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = await configService.get('PORT');

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: ['localhost'],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  app.use(compression());
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(port);
}
bootstrap();

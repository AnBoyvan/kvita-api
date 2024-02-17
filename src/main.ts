import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { ErrorFilter } from './middlewares/error-filter.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = await configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('KViTa API')
    .setVersion('1.0')
    .addTag('КВіТа')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('specification', app, document);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ErrorFilter());
  app.enableCors();
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, 'https:', `'unsafe-inline'`],
        },
      },
    }),
  );
  app.use(compression());
  await app.listen(port);
}
bootstrap();

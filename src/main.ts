import helmet from 'helmet';
import mongoose from 'mongoose';

import { Logger, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { ValidationPipe } from '@shared/pipes/validation.pipe';

import { AppModule } from './app/app.module';
import { setupSwagger } from './viveo-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const env = configService.get<string>('app.env');
  const versioning = configService.get<string>('app.versioning');
  const appDebug = configService.get<boolean>('app.debug');
  const databaseDebug = configService.get<boolean>('database.debug');
  const logger = new Logger();

  if (versioning) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: VERSION_NEUTRAL,
    });
  }

  mongoose.set('debug', true);
  setupSwagger(app, env);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new TranslateInterceptor());

  await app.listen(port);

  logger.log(`==========================================================`);
  logger.log(`App Environment is ${env}`, 'NestApplication');
  logger.log(
    `App Debug is ${appDebug ? 'enabled' : 'disabled'}`,
    'NestApplication',
  );
  logger.log(
    `App Versioning is ${versioning ? 'on' : 'off'}`,
    'NestApplication',
  );
  logger.log(
    `Database Debug is ${databaseDebug ? 'enabled' : 'disabled'}`,
    'NestApplication',
  );

  logger.log(`==========================================================`);

  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

  logger.log(`==========================================================`);
}
bootstrap();

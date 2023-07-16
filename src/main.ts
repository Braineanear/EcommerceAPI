import helmet from 'helmet';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@shared/pipes/validation.pipe';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const env = configService.get<string>('app.env');
  const schema = {
    production: configService.get<string>('app.productionURL'),
    staging: configService.get<string>('app.stagingURL'),
    development: configService.get<string>('app.developmentURL'),
    local: configService.get<string>('app.localURL'),
  };
  const options = new DocumentBuilder()
    .setTitle('API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addServer(schema[env])
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<number>('app.port'));

  logger.log(`==========================================================`);
  logger.log(`App Environment is ${env}`, 'NestApplication');

  logger.log(`==========================================================`);

  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

  logger.log(`==========================================================`);
}
bootstrap();

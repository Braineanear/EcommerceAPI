import helmet from 'helmet';
import { json } from 'body-parser';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@shared/pipes/validation.pipe';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(cookieParser());
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
  // allowedHeaders:
  //   'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,Content-Type,Authorization,X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Access-Control-Allow-Credentials, Access-Control-Allow-Origin, Access-Control-Allow-Headers',
  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(helmet());
  // app.use(json({ limit: '5mb' }));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<number>('app.port'));

  logger.log(`==========================================================`);
  logger.log(`App Environment is ${env}`, 'NestApplication');

  logger.log(`==========================================================`);

  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

  logger.log(`==========================================================`);
}
bootstrap();

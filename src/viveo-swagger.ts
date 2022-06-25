import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication, env: string) {
  const schema = {
    production: 'https',
    staging: 'https',
    development: 'http',
  };
  const options = new DocumentBuilder()
    .setTitle('API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addServer(`${schema[env]}://${env}`)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    snapshot: process.env.NODE_ENV === 'development' ? false : true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Enables automatic transformation of payloads to DTO instances
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  const config = new DocumentBuilder()
    .setTitle('PCMA API')
    .setDescription(
      'This is the Pcma API documentation. Here you can find all the endpoints and their respective data models and',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

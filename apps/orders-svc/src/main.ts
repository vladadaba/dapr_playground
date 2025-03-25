import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function createSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setDescription('API')
    .setVersion('1.0')
    .addServer('/orders-svc')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  createSwagger(app);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();

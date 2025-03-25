import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { type NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // Support CloudEvent - Structured mode parsing
  app.useBodyParser('json', {
    // requried because dapr uses CloudEvents - https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-cloudevents/
    type: 'application/cloudevents+json',
  });
  await app.listen(3000);
}
bootstrap();

import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { configureApp } from './configs/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const baseUrl =
    process.env.APP_URL ?? `http://localhost:${process.env.APP_PORT ?? 3000}`;

  await app.listen(process.env.APP_PORT ?? 3000);

  console.log(`Docs available at ${baseUrl}/api/docs`);
}
bootstrap();

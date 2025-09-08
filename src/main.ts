import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { configureApp } from './configs/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  console.log(
    `Docs available at http://localhost:${process.env.APP_PORT ?? 3000}/api/docs`,
  );

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();

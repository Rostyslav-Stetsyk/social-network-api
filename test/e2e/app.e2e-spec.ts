import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { type INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { configureApp } from 'src/configs/app.config';
import cacheOptions from 'src/configs/cache.config';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import * as request from 'supertest';
import { startContainers, stopContainers } from 'test/utils/test-containers';

jest.setTimeout(60000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await startContainers();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        CacheModule.registerAsync(cacheOptions),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    configureApp(app);

    await app.init();
  });

  afterAll(async () => {
    const cache = app.get(CACHE_MANAGER);
    cache.store.client.quit();

    await stopContainers();
    await app.close();
  });
  describe('/api/docs [GET]', () => {
    it('should return 200', async () => {
      const server = app.getHttpServer();

      const response = await request(server).get('/api/docs');

      expect(response.status).toBe(200);
    });
  });
});

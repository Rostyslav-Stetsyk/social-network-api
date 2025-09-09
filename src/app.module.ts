import 'dotenv/config';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import cacheOptions from './configs/cache.config';
import { typeOrmConfig } from './configs/typeorm.config';
import { HealthModule } from './health/health.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    PostsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    CacheModule.registerAsync(cacheOptions),
  ],
})
export class AppModule {}

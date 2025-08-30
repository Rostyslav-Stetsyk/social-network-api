import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { typeOrmConfig } from './configs/typeorm.config';
import cacheOptions from './configs/cache.config';
import 'dotenv/config';

@Module({
  imports: [
    AuthModule,
    PostsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    CacheModule.registerAsync(cacheOptions),
  ],
})
export class AppModule {}

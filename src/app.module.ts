import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import 'dotenv/config';
import { typeOrmConfig } from 'typeorm.config';

const cacheOptions = {
  isGlobal: true,
  useFactory: async (): Promise<CacheOptions> => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      password: process.env.REDIS_PASSWORD || 'redis_password',
    });
    return {
      store,
    };
  },
};

@Module({
  imports: [
    AuthModule,
    PostsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    CacheModule.registerAsync(cacheOptions),
  ],
})
export class AppModule {}

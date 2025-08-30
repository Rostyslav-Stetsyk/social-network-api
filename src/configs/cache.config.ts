import type { CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import 'dotenv/config';

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

export default cacheOptions;

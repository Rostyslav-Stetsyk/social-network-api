import 'dotenv/config';

import type { CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

const cacheOptions = {
  isGlobal: true,
  useFactory: async (): Promise<CacheOptions> => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      username: process.env.REDIS_USER || 'default',
      password: process.env.REDIS_PASS,
    });
    return {
      store,
    };
  },
};

export default cacheOptions;

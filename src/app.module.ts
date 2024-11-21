import { PostsModule } from './posts/posts.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { UserEntity } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { PostEntity } from './posts/entity/posts.entity';
import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

const ormOptions: TypeOrmModule = {
  type: 'postgres',
  host: env.DB_HOST || 'localhost',
  port: Number(env.DB_PORT) || 5432,
  username: env.DB_USER || 'postgres',
  password: env.DB_PASSWORD || 'postgres',
  database: env.DB_NAME || 'waveup',
  entities: [UserEntity, PostEntity],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: ['src/migrations/*.ts'],
};

const cacheOptions = {
  isGlobal: true,
  useFactory: async (): Promise<CacheOptions> => {
    const store = await redisStore({
      socket: {
        host: 'localhost',
        port: 6379,
      },
      password: 'redis_password',
    });
    return {
      store,
    };
  },
};

@Module({
  imports: [
    PostsModule,
    UsersModule,
    TypeOrmModule.forRoot(ormOptions),
    CacheModule.registerAsync(cacheOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

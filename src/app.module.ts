import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { PostsModule } from './posts/posts.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';
import { PostEntity } from './posts/entity/post.entity';
import { CacheModule, CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import 'dotenv/config';
import { SessionEntity } from './sessions/entity/session.entity';
import { JwtModule } from '@nestjs/jwt';

const ormOptions: TypeOrmModule = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'waveup',
  entities: [UserEntity, PostEntity, SessionEntity],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  subscribers: [],
  migrations: ['src/migrations/*.ts'],
};

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
    SessionsModule,
    PostsModule,
    UsersModule,
    TypeOrmModule.forRoot(ormOptions),
    CacheModule.registerAsync(cacheOptions),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { UserEntity } from './users/entity/user.entity';
import { UsersModule } from './users/users.module';

const ormOptions: TypeOrmModule = {
  type: 'postgres',
  host: env.DB_HOST || 'localhost',
  port: Number(env.DB_PORT) || 5432,
  username: env.DB_USER || 'postgres',
  password: env.DB_PASSWORD || 'postgres',
  database: env.DB_NAME || 'waveup',
  entities: [UserEntity],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: ['src/migrations/*.ts'],
};

@Module({
  imports: [TypeOrmModule.forRoot(ormOptions), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

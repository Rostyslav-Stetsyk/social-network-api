import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { UserEntity } from './users/entity/user.entity';

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
  imports: [TypeOrmModule.forRoot(ormOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

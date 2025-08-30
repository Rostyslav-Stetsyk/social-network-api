import { DataSource, type DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'waveup',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: process.env.NODE_ENV === 'production',
  migrationsTransactionMode: 'all',
  migrationsTableName: 'migrations',
  logging: process.env.NODE_ENV !== 'production',
};

export default new DataSource(typeOrmConfig);

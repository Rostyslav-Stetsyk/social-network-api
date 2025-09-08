import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import type { StartedTestContainer } from 'testcontainers';

let postgresContainer: StartedTestContainer;
let redisContainer: StartedTestContainer;

const DB_PORT = 5432;
const DB_USER = 'test';
const DB_PASS = 'test';
const DB_NAME = 'testdb';
const DB_VERSION = 'postgres:latest';

const REDIS_PORT = 6379;
const REDIS_USER = 'default';
const REDIS_PASS = 'redis_password';
const REDIS_VERSION = 'redis:latest';

export async function startContainers(): Promise<void> {
  postgresContainer = await new PostgreSqlContainer(DB_VERSION)
    .withDatabase(DB_NAME)
    .withExposedPorts(DB_PORT)
    .withUsername(DB_USER)
    .withPassword(DB_PASS)
    .start();

  redisContainer = await new RedisContainer(REDIS_VERSION)
    .withExposedPorts(DB_PORT)
    .withCommand([
      'redis-server',
      `--user ${REDIS_USER} on >${REDIS_PASS} ~* +@all`,
    ])
    .start();

  process.env.DB_HOST = postgresContainer.getHost();
  process.env.DB_PORT = postgresContainer.getMappedPort(DB_PORT).toString();
  process.env.DB_USER = DB_USER;
  process.env.DB_PASS = DB_PASS;
  process.env.DB_NAME = DB_NAME;

  process.env.REDIS_HOST = redisContainer.getHost();
  process.env.REDIS_PORT = redisContainer.getMappedPort(REDIS_PORT).toString();
  process.env.REDIS_USER = REDIS_USER;
  process.env.REDIS_PASS = REDIS_PASS;
}

export async function stopContainers(): Promise<void> {
  await postgresContainer.stop();
  await redisContainer.stop();
}

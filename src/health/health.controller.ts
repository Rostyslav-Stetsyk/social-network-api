import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HealthIndicatorService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisCache } from 'cache-manager-redis-yet';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    @Inject(CACHE_MANAGER)
    private cacheManager: RedisCache,
    private healthIndicatorService: HealthIndicatorService,
  ) {}
  @Get('health')
  @HealthCheck()
  async check(): Promise<{ status: string }> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> => this.db.pingCheck('postgres'),
      (): Promise<HealthIndicatorResult> =>
        this.disk.checkStorage('storage', {
          thresholdPercent: 0.9,
          path: process.cwd(),
        }),
      async (): Promise<HealthIndicatorResult> => {
        const indicator = this.healthIndicatorService.check('redis');
        const isHealthy = await this.cacheManager.store.client.ping();

        if (isHealthy !== 'PONG') {
          return indicator.down({ message: 'Redis is not reachable' });
        }

        return indicator.up();
      },
    ]);
  }
}

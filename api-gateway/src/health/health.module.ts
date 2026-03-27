import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthCheckService } from 'src/common/health-check/health-check.service';

@Module({
  imports: [HealthCheckService],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}

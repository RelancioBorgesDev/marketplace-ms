import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './service/proxy.service';
import { CircuitBreakerModule } from 'src/common/circuit-breaker/circuit-breaker.module';
import { FallbackModule } from 'src/common/fallback/fallback.module';
import { TimeoutModule } from 'src/common/timeout/timeout.module';
import { RetryModule } from 'src/common/retry/retry.module';

@Module({
  imports: [
    HttpModule,
    CircuitBreakerModule,
    FallbackModule,
    RetryModule,
    TimeoutModule,
  ],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}

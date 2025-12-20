import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';

import { ShutdownHealthIndicator } from './shutdown-health-indicator';

@Controller('health')
export class HealthController {
    constructor(private health: HealthCheckService, private shutdownHealthIndicator: ShutdownHealthIndicator) {}

    @Get('liveness')
    @HealthCheck()
    liveness(): Promise<HealthCheckResult> {
        return this.health.check([]);
    }

    @Get('readiness')
    @HealthCheck()
    readiness(): Promise<HealthCheckResult> {
        return this.health.check([
            (): HealthIndicatorResult => this.shutdownHealthIndicator.isShuttingDown('application_status'),
        ]);
    }
}

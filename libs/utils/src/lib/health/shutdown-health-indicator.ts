import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';

import { ShutdownService } from './shutdown-service.service';

@Injectable()
export class ShutdownHealthIndicator {
    constructor(
        private readonly shutdownService: ShutdownService,
        private readonly healthIndicatorService: HealthIndicatorService
    ) {}

    isShuttingDown(key: string): HealthIndicatorResult {
        const isHealthy = this.shutdownService.isHealthy();

        const indicator = this.healthIndicatorService.check(key);

        if (isHealthy) {
            return indicator.up();
        } else {
            return indicator.down({ message: 'Service is shutting down' });
        }
    }
}

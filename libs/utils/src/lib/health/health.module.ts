import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';

@Module({
    imports: [TerminusModule],
    controllers: [HealthController],
    providers: [ShutdownHealthIndicator, ShutdownService],
})
export class HealthModule {}

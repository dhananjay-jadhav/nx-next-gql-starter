import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';
import { ConfigModule } from '@nestjs/config';
import healthConfig, { HealthVariables } from './health.config';
import { createValidator } from '../env-validation/env.validation';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            load: [healthConfig],
            validate: createValidator(HealthVariables),
        }),
        TerminusModule,
    ],
    controllers: [HealthController],
    providers: [ShutdownHealthIndicator, ShutdownService],
})
export class HealthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { createValidator } from '../env-validation/env.validation';
import healthConfig, { HealthVariables } from './health.config';
import { HealthController } from './health.controller';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';

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

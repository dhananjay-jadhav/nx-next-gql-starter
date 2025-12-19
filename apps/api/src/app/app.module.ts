import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { HealthModule } from '../health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        LoggerModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                pinoHttp: {
                    level: config.getOrThrow('LOG_LEVEL', 'info'),
                    autoLogging: false,
                    quietReqLogger: true,
                    quietResLogger: true,
                    timestamp: (): string => ` "Timestamp" : "${new Date().toISOString()}" `,
                    formatters: {
                        level: (label: string): { level: string } => {
                            return { level: label };
                        },
                    },
                },
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { HealthModule } from '../health/health.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloPluginsModule, ApolloPluginsService } from '@app/utils';

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
        GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
            useFactory: (apolloPluginsService: ApolloPluginsService) => {
                return {
                    path: '/graphql',
                    autoSchemaFile: {
                        path: join(process.cwd(), 'apps/api/src/schema.gql'),
                        federation: 2,
                    },
                    sortSchema: true,
                    playground: false,
                    context: ({ req, res }) => ({ req, res }),
                    plugins: apolloPluginsService.plugins,
                }
            },
            imports: [ApolloPluginsModule],
            inject: [ApolloPluginsService],
            driver: ApolloFederationDriver,
        }),
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }

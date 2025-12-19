import { ApolloPluginsModule, ApolloPluginsService } from '@app/utils';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';

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
                    /* eslint-disable-next-line */
                    context: ({ req, res }) => ({ req, res }),
                    plugins: apolloPluginsService.plugins,
                };
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
export class AppModule {}

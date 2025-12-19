import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Injectable()
export class ApolloPluginsService implements OnModuleInit {
  public plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })];
  private readonly logger = new Logger(ApolloPluginsService.name);

  // Inject the HttpAdapterHost to get access to the underlying HTTP server.
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // This lifecycle hook runs after the host module's dependencies have been resolved.
  onModuleInit() {
    const httpServer = this.httpAdapterHost.httpAdapter?.getHttpServer();

    if (httpServer) {
      this.plugins.push(
        // The drain plugin is created here, when httpServer is guaranteed to be available.
        ApolloServerPluginDrainHttpServer({ httpServer }),
      );
      this.logger.log('Enabled the Drain HTTP Server Plugin!!!!');
    } else {
      this.logger.warn('HTTP server not available. ApolloServerPluginDrainHttpServer not initialized.');
    }
  }
}
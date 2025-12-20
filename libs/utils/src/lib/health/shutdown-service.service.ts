import { Injectable, Logger,OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
    private static isShuttingDown = false;

    onApplicationShutdown(signal?: string): void {
        Logger.log(`Received shutdown signal: ${signal}. App is now shutting down.`, 'ShutdownService');
        ShutdownService.isShuttingDown = true;
    }

    isHealthy(): boolean {
        return !ShutdownService.isShuttingDown;
    }
}

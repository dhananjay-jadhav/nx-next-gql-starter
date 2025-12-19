/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const logger = app.get(PinoLogger);

    const config = app.get(ConfigService);

    app.useLogger(logger);

    const port = parseInt(config.getOrThrow('API_PORT', '3000'));
    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap()
    .then(() => {
        Logger.log('Application started successfully......🚀 🚀 ');
    })
    .catch(err => {
        Logger.error(`Error at the root level of the application.....`, err);
    });

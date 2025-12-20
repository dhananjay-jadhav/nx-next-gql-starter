import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ShutdownService } from './shutdown-service.service';

describe('ShutdownService', () => {
    let service: ShutdownService;

    // Store original static property value to reset between tests
    const resetShutdownState = () => {
        // Access the private static property using any type assertion
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ShutdownService as any).isShuttingDown = false;
    };

    beforeEach(async () => {
        // Reset the static state before each test
        resetShutdownState();

        const module: TestingModule = await Test.createTestingModule({
            providers: [ShutdownService],
        }).compile();

        service = module.get<ShutdownService>(ShutdownService);
    });

    afterEach(() => {
        // Clean up after each test
        resetShutdownState();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('isHealthy', () => {
        it('should return true when service is not shutting down', () => {
            const result = service.isHealthy();

            expect(result).toBe(true);
        });

        it('should return false after onApplicationShutdown is called', async () => {
            await service.onApplicationShutdown('SIGTERM');

            const result = service.isHealthy();

            expect(result).toBe(false);
        });
    });

    describe('onApplicationShutdown', () => {
        let loggerSpy: jest.SpyInstance;

        beforeEach(() => {
            loggerSpy = jest.spyOn(Logger, 'log').mockImplementation();
        });

        afterEach(() => {
            loggerSpy.mockRestore();
        });

        it('should log the shutdown signal', async () => {
            await service.onApplicationShutdown('SIGTERM');

            expect(loggerSpy).toHaveBeenCalledWith(
                'Received shutdown signal: SIGTERM. App is now shutting down.',
                'ShutdownService'
            );
        });

        it('should set isShuttingDown to true', async () => {
            expect(service.isHealthy()).toBe(true);

            await service.onApplicationShutdown('SIGINT');

            expect(service.isHealthy()).toBe(false);
        });

        it('should handle SIGTERM signal', async () => {
            await service.onApplicationShutdown('SIGTERM');

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('SIGTERM'),
                'ShutdownService'
            );
            expect(service.isHealthy()).toBe(false);
        });

        it('should handle SIGINT signal', async () => {
            await service.onApplicationShutdown('SIGINT');

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('SIGINT'),
                'ShutdownService'
            );
            expect(service.isHealthy()).toBe(false);
        });

        it('should handle undefined signal', async () => {
            await service.onApplicationShutdown(undefined);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Received shutdown signal: undefined. App is now shutting down.',
                'ShutdownService'
            );
            expect(service.isHealthy()).toBe(false);
        });

        it('should handle SIGHUP signal', async () => {
            await service.onApplicationShutdown('SIGHUP');

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('SIGHUP'),
                'ShutdownService'
            );
            expect(service.isHealthy()).toBe(false);
        });
    });

    describe('static state behavior', () => {
        it('should share shutdown state across instances', async () => {
            // Create a second instance
            const module: TestingModule = await Test.createTestingModule({
                providers: [ShutdownService],
            }).compile();
            const secondService = module.get<ShutdownService>(ShutdownService);

            // Both should be healthy initially
            expect(service.isHealthy()).toBe(true);
            expect(secondService.isHealthy()).toBe(true);

            // Trigger shutdown on first instance
            await service.onApplicationShutdown('SIGTERM');

            // Both should reflect the shutdown state
            expect(service.isHealthy()).toBe(false);
            expect(secondService.isHealthy()).toBe(false);
        });

        it('should remain in shutdown state once triggered', async () => {
            await service.onApplicationShutdown('SIGTERM');

            expect(service.isHealthy()).toBe(false);

            // Multiple calls should not change the state back
            expect(service.isHealthy()).toBe(false);
            expect(service.isHealthy()).toBe(false);
        });
    });

    describe('OnApplicationShutdown interface', () => {
        it('should implement OnApplicationShutdown interface', () => {
            expect(typeof service.onApplicationShutdown).toBe('function');
        });

        it('should resolve without error', async () => {
            await expect(service.onApplicationShutdown('SIGTERM')).toBeUndefined();
        });
    });
});

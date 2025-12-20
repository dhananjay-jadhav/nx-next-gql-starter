import { HealthCheckService, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';

describe('HealthController', () => {
    let controller: HealthController;
    let healthCheckService: jest.Mocked<HealthCheckService>;
    let shutdownHealthIndicator: jest.Mocked<ShutdownHealthIndicator>;

    const mockHealthCheckResult: HealthCheckResult = {
        status: 'ok',
        info: {},
        error: {},
        details: {},
    };

    const mockHealthIndicatorResult: HealthIndicatorResult = {
        application_status: {
            status: 'up',
        },
    };

    beforeEach(async () => {
        const mockHealthCheckService = {
            check: jest.fn(),
        };

        const mockShutdownHealthIndicator = {
            isShuttingDown: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthCheckService,
                    useValue: mockHealthCheckService,
                },
                {
                    provide: ShutdownHealthIndicator,
                    useValue: mockShutdownHealthIndicator,
                },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
        healthCheckService = module.get(HealthCheckService);
        shutdownHealthIndicator = module.get(ShutdownHealthIndicator);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('liveness', () => {
        it('should call health.check with empty array', async () => {
            healthCheckService.check.mockResolvedValue(mockHealthCheckResult);

            const result = await controller.liveness();

            expect(healthCheckService.check).toHaveBeenCalledWith([]);
            expect(result).toEqual(mockHealthCheckResult);
        });

        it('should return healthy status when service is up', async () => {
            const healthyResult: HealthCheckResult = {
                status: 'ok',
                info: {},
                error: {},
                details: {},
            };
            healthCheckService.check.mockResolvedValue(healthyResult);

            const result = await controller.liveness();

            expect(result.status).toBe('ok');
        });

        it('should propagate errors from health check service', async () => {
            const error = new Error('Health check failed');
            healthCheckService.check.mockRejectedValue(error);

            await expect(controller.liveness()).rejects.toThrow('Health check failed');
        });
    });

    describe('readiness', () => {
        it('should call health.check with shutdown health indicator', async () => {
            healthCheckService.check.mockResolvedValue(mockHealthCheckResult);
            shutdownHealthIndicator.isShuttingDown.mockReturnValue(mockHealthIndicatorResult);

            const result = await controller.readiness();

            expect(healthCheckService.check).toHaveBeenCalledWith([expect.any(Function)]);
            expect(result).toEqual(mockHealthCheckResult);
        });

        it('should execute the shutdown health indicator check function', async () => {
            healthCheckService.check.mockImplementation(async (indicators) => {
                // Execute the indicator function passed to check
                if (indicators.length > 0 && typeof indicators[0] === 'function') {
                    indicators[0]();
                }
                return mockHealthCheckResult;
            });
            shutdownHealthIndicator.isShuttingDown.mockReturnValue(mockHealthIndicatorResult);

            await controller.readiness();

            expect(shutdownHealthIndicator.isShuttingDown).toHaveBeenCalledWith('application_status');
        });

        it('should return healthy status when application is ready', async () => {
            const readyResult: HealthCheckResult = {
                status: 'ok',
                info: {
                    application_status: { status: 'up' },
                },
                error: {},
                details: {
                    application_status: { status: 'up' },
                },
            };
            healthCheckService.check.mockResolvedValue(readyResult);

            const result = await controller.readiness();

            expect(result.status).toBe('ok');
        });

        it('should return unhealthy status when application is shutting down', async () => {
            const shuttingDownResult: HealthCheckResult = {
                status: 'error',
                info: {},
                error: {
                    application_status: {
                        status: 'down',
                        message: 'Service is shutting down',
                    },
                },
                details: {
                    application_status: {
                        status: 'down',
                        message: 'Service is shutting down',
                    },
                },
            };
            healthCheckService.check.mockResolvedValue(shuttingDownResult);

            const result = await controller.readiness();

            expect(result.status).toBe('error');
        });

        it('should propagate errors from health check service', async () => {
            const error = new Error('Readiness check failed');
            healthCheckService.check.mockRejectedValue(error);

            await expect(controller.readiness()).rejects.toThrow('Readiness check failed');
        });
    });
});

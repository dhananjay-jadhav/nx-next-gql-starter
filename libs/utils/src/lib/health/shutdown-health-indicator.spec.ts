import { HealthIndicatorService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';

describe('ShutdownHealthIndicator', () => {
    let indicator: ShutdownHealthIndicator;
    let shutdownService: jest.Mocked<ShutdownService>;
    let healthIndicatorService: jest.Mocked<HealthIndicatorService>;

    const mockIndicatorCheck = {
        up: jest.fn(),
        down: jest.fn(),
    };

    beforeEach(async () => {
        const mockShutdownService = {
            isHealthy: jest.fn(),
        };

        const mockHealthIndicatorService = {
            check: jest.fn().mockReturnValue(mockIndicatorCheck),
        };

        mockIndicatorCheck.up.mockClear();
        mockIndicatorCheck.down.mockClear();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShutdownHealthIndicator,
                {
                    provide: ShutdownService,
                    useValue: mockShutdownService,
                },
                {
                    provide: HealthIndicatorService,
                    useValue: mockHealthIndicatorService,
                },
            ],
        }).compile();

        indicator = module.get<ShutdownHealthIndicator>(ShutdownHealthIndicator);
        shutdownService = module.get(ShutdownService);
        healthIndicatorService = module.get(HealthIndicatorService);
    });

    it('should be defined', () => {
        expect(indicator).toBeDefined();
    });

    describe('isShuttingDown', () => {
        const testKey = 'application_status';

        it('should call healthIndicatorService.check with the provided key', () => {
            shutdownService.isHealthy.mockReturnValue(true);
            mockIndicatorCheck.up.mockReturnValue({ [testKey]: { status: 'up' } });

            indicator.isShuttingDown(testKey);

            expect(healthIndicatorService.check).toHaveBeenCalledWith(testKey);
        });

        it('should return up status when service is healthy', () => {
            const expectedResult = { [testKey]: { status: 'up' } };
            shutdownService.isHealthy.mockReturnValue(true);
            mockIndicatorCheck.up.mockReturnValue(expectedResult);

            const result = indicator.isShuttingDown(testKey);

            expect(shutdownService.isHealthy).toHaveBeenCalled();
            expect(mockIndicatorCheck.up).toHaveBeenCalled();
            expect(mockIndicatorCheck.down).not.toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('should return down status with message when service is shutting down', () => {
            const expectedResult = {
                [testKey]: {
                    status: 'down',
                    message: 'Service is shutting down',
                },
            };
            shutdownService.isHealthy.mockReturnValue(false);
            mockIndicatorCheck.down.mockReturnValue(expectedResult);

            const result = indicator.isShuttingDown(testKey);

            expect(shutdownService.isHealthy).toHaveBeenCalled();
            expect(mockIndicatorCheck.down).toHaveBeenCalledWith({ message: 'Service is shutting down' });
            expect(mockIndicatorCheck.up).not.toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('should work with different key names', () => {
            const customKey = 'custom_health_key';
            const expectedResult = { [customKey]: { status: 'up' } };
            shutdownService.isHealthy.mockReturnValue(true);
            mockIndicatorCheck.up.mockReturnValue(expectedResult);

            const result = indicator.isShuttingDown(customKey);

            expect(healthIndicatorService.check).toHaveBeenCalledWith(customKey);
            expect(result).toEqual(expectedResult);
        });

        it('should check shutdown service health on each call', () => {
            shutdownService.isHealthy.mockReturnValue(true);
            mockIndicatorCheck.up.mockReturnValue({ [testKey]: { status: 'up' } });

            indicator.isShuttingDown(testKey);
            indicator.isShuttingDown(testKey);
            indicator.isShuttingDown(testKey);

            expect(shutdownService.isHealthy).toHaveBeenCalledTimes(3);
        });
    });
});

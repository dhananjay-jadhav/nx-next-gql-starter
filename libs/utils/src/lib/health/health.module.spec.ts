import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthModule } from './health.module';
import { ShutdownHealthIndicator } from './shutdown-health-indicator';
import { ShutdownService } from './shutdown-service.service';

describe('HealthModule', () => {
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [HealthModule],
        }).compile();
    });

    afterEach(async () => {
        if (module) {
            await module.close();
        }
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    describe('module configuration', () => {
        it('should provide HealthController', () => {
            const controller = module.get<HealthController>(HealthController);

            expect(controller).toBeDefined();
            expect(controller).toBeInstanceOf(HealthController);
        });

        it('should provide ShutdownHealthIndicator', () => {
            const indicator = module.get<ShutdownHealthIndicator>(ShutdownHealthIndicator);

            expect(indicator).toBeDefined();
            expect(indicator).toBeInstanceOf(ShutdownHealthIndicator);
        });

        it('should provide ShutdownService', () => {
            const service = module.get<ShutdownService>(ShutdownService);

            expect(service).toBeDefined();
            expect(service).toBeInstanceOf(ShutdownService);
        });
    });

    describe('dependency injection', () => {
        it('should inject dependencies into HealthController', () => {
            const controller = module.get<HealthController>(HealthController);

            // Controller should be properly instantiated with its dependencies
            expect(controller).toBeDefined();
            expect(typeof controller.liveness).toBe('function');
            expect(typeof controller.readiness).toBe('function');
        });

        it('should inject ShutdownService into ShutdownHealthIndicator', () => {
            const indicator = module.get<ShutdownHealthIndicator>(ShutdownHealthIndicator);

            // Indicator should be properly instantiated with its dependencies
            expect(indicator).toBeDefined();
            expect(typeof indicator.isShuttingDown).toBe('function');
        });

        it('should have ShutdownService implement OnApplicationShutdown', () => {
            const service = module.get<ShutdownService>(ShutdownService);

            expect(typeof service.onApplicationShutdown).toBe('function');
        });
    });

    describe('TerminusModule integration', () => {
        it('should have access to HealthCheckService through TerminusModule', async () => {
            // HealthController depends on HealthCheckService from TerminusModule
            // If the module compiles successfully, TerminusModule is properly imported
            const controller = module.get<HealthController>(HealthController);

            expect(controller).toBeDefined();
        });

        it('should have access to HealthIndicatorService through TerminusModule', () => {
            // ShutdownHealthIndicator depends on HealthIndicatorService from TerminusModule
            const indicator = module.get<ShutdownHealthIndicator>(ShutdownHealthIndicator);

            expect(indicator).toBeDefined();
        });
    });

    describe('module exports', () => {
        it('should allow importing HealthModule in other modules', async () => {
            // Test that the module can be imported without errors
            const parentModule = await Test.createTestingModule({
                imports: [HealthModule],
            }).compile();

            expect(parentModule).toBeDefined();
            await parentModule.close();
        });
    });
});

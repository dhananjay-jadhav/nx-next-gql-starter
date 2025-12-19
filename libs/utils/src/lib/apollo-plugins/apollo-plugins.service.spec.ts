import { Test, TestingModule } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import { ApolloPluginsService } from './apollo-plugins.service';

describe('ApolloPluginsService', () => {
    let service: ApolloPluginsService;
    let mockHttpAdapterHost: Partial<HttpAdapterHost>;

    describe('Unit Tests', () => {
        beforeEach(async () => {
            mockHttpAdapterHost = {
                httpAdapter: {
                    getHttpServer: jest.fn().mockReturnValue(null),
                } as any,
            };

            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    ApolloPluginsService,
                    { provide: HttpAdapterHost, useValue: mockHttpAdapterHost },
                ],
            }).compile();

            service = module.get<ApolloPluginsService>(ApolloPluginsService);
        });

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        it('should have landing page plugin by default', () => {
            expect(service.plugins).toHaveLength(1);
        });
    });

    describe('Integration Tests', () => {
        describe('when HTTP server is available', () => {
            let mockHttpServer: object;

            beforeEach(async () => {
                mockHttpServer = {
                    listen: jest.fn(),
                    close: jest.fn(),
                    on: jest.fn(),
                    off: jest.fn(),
                    removeListener: jest.fn(),
                };
                mockHttpAdapterHost = {
                    httpAdapter: {
                        getHttpServer: jest.fn().mockReturnValue(mockHttpServer),
                    } as any,
                };

                const module: TestingModule = await Test.createTestingModule({
                    providers: [
                        ApolloPluginsService,
                        { provide: HttpAdapterHost, useValue: mockHttpAdapterHost },
                    ],
                }).compile();

                service = module.get<ApolloPluginsService>(ApolloPluginsService);
            });

            it('should add DrainHttpServer plugin on module init', () => {
                const initialPluginCount = service.plugins.length;

                service.onModuleInit();

                expect(service.plugins.length).toBe(initialPluginCount + 1);
            });

            it('should call getHttpServer during onModuleInit', () => {
                service.onModuleInit();

                expect(mockHttpAdapterHost.httpAdapter?.getHttpServer).toHaveBeenCalled();
            });

            it('should have both landing page and drain plugins after init', () => {
                service.onModuleInit();

                expect(service.plugins.length).toBe(2);
            });
        });

        describe('when HTTP server is not available', () => {
            beforeEach(async () => {
                mockHttpAdapterHost = {
                    httpAdapter: {
                        getHttpServer: jest.fn().mockReturnValue(null),
                    } as any,
                };

                const module: TestingModule = await Test.createTestingModule({
                    providers: [
                        ApolloPluginsService,
                        { provide: HttpAdapterHost, useValue: mockHttpAdapterHost },
                    ],
                }).compile();

                service = module.get<ApolloPluginsService>(ApolloPluginsService);
            });

            it('should not add DrainHttpServer plugin when server is unavailable', () => {
                const initialPluginCount = service.plugins.length;

                service.onModuleInit();

                expect(service.plugins.length).toBe(initialPluginCount);
            });

            it('should still have landing page plugin', () => {
                service.onModuleInit();

                expect(service.plugins.length).toBe(1);
            });
        });

        describe('when httpAdapter is undefined', () => {
            beforeEach(async () => {
                mockHttpAdapterHost = {
                    httpAdapter: undefined,
                };

                const module: TestingModule = await Test.createTestingModule({
                    providers: [
                        ApolloPluginsService,
                        { provide: HttpAdapterHost, useValue: mockHttpAdapterHost },
                    ],
                }).compile();

                service = module.get<ApolloPluginsService>(ApolloPluginsService);
            });

            it('should handle undefined httpAdapter gracefully', () => {
                expect(() => service.onModuleInit()).not.toThrow();
            });

            it('should not add DrainHttpServer plugin', () => {
                const initialPluginCount = service.plugins.length;

                service.onModuleInit();

                expect(service.plugins.length).toBe(initialPluginCount);
            });
        });
    });
});

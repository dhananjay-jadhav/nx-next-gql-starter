import { Test, TestingModule } from '@nestjs/testing';
import { ApolloPluginsService } from './apollo-plugins.service';

describe('ApolloPluginsService', () => {
    let service: ApolloPluginsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApolloPluginsService],
        }).compile();

        service = module.get<ApolloPluginsService>(ApolloPluginsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

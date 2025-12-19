import { Module } from '@nestjs/common';

import { ApolloPluginsService } from './apollo-plugins.service';

@Module({
    providers: [ApolloPluginsService],
    exports: [ApolloPluginsService],
})
export class ApolloPluginsModule {}

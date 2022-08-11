import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ThrottlerBehindProxyGuard } from '../common/throttler-behind-proxy.guard';

import * as redisStore from 'cache-manager-redis-store';
import { REDIS } from '../conf/redis';

import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';

import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ...REDIS,
      db: 1,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
      storage: new ThrottlerStorageRedisService({ ...REDIS, db: 1 }),
    }),
    MovieModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    AppService,
  ],
})
export class AppModule {}

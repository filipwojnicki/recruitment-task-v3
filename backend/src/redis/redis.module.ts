import { Module } from '@nestjs/common';

import { createClient } from 'redis';
import { REDIS } from '../conf/redis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: `redis://${REDIS.host}:${REDIS.port}`,
          password: REDIS.password,
          database: 0,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { REDIS } from './conf/redis';
import { QueueModule } from './queue/queue.module';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: { ...REDIS },
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    QueueModule,
  ],
})
export class AppModule {}

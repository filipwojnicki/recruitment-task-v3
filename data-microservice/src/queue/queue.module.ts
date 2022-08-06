import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { DatabaseModule } from './../database/database.module';

import { QueueService } from './service/queue.service';
import { FileHandlerProcessor } from './processor/file-handler-processor.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'fileHandler',
    }),
    DatabaseModule,
  ],
  providers: [QueueService, FileHandlerProcessor],
})
export class QueueModule {}

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';

import { Queue } from 'bull';
import type { JobOptions } from 'bull';

import { DatabaseChangedEvent } from '../../database/events/database-changed.event';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('fileHandler') private readonly fileHandlerQueue: Queue,
  ) {}

  @OnEvent('database.changed')
  async handleDatabasesChangedEvent(payload: DatabaseChangedEvent) {
    this.logger.debug('Database changed');
    this.addToQueue(payload.name, payload.data, payload.options);
  }

  async addToQueue(name: string, data, options?: JobOptions): Promise<void> {
    await this.fileHandlerQueue.add(name, data, options);
  }
}

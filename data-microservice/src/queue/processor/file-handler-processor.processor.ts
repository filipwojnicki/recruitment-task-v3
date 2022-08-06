import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

import { DatabaseService } from 'src/database/service/database.service';

@Processor('fileHandler')
export class FileHandlerProcessor {
  private readonly logger = new Logger(FileHandlerProcessor.name);

  constructor(private readonly dbService: DatabaseService) {}

  @Process({ name: 'write-file', concurrency: 1 })
  async handleWriting() {
    this.logger.debug('Writing file');
    await this.dbService.writeData();
    this.logger.debug('Writing file completed');
  }
}

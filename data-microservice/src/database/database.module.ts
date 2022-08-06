import { Module } from '@nestjs/common';

import { dynamicImport } from '../common/utils';

import { DatabaseService } from './service/database.service';
import { DatabaseController } from './controller/database.controller';

@Module({
  providers: [
    DatabaseService,
    {
      provide: DatabaseService,
      async useFactory() {
        return new DatabaseService(await dynamicImport('lowdb'));
      },
    },
  ],
  exports: [DatabaseService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}

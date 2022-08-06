import { Module } from '@nestjs/common';
import { DatabaseService } from './service/database.service';

import { dynamicImport } from '../common/utils';

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
})
export class DatabaseModule {}

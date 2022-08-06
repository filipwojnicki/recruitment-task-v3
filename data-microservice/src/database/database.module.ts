import { Module } from '@nestjs/common';
import { DatabaseService } from './service/database.service';
import { DatabaseController } from './controller/database.controller';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { DatabaseService } from './service/database.service';
import { DatabaseController } from './controller/database.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
  controllers: [DatabaseController],
})
export class DatabaseModule {}

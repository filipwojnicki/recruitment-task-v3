import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../service/database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get()
  getData() {
    return this.dbService.getData();
  }
}

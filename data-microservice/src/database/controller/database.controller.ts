import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../service/database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @Get()
  async getData() {
    const data = await this.dbService.getData();
    this.dbService.updateData(data);
    return data;
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { DatabaseService } from '../service/database.service';

@Controller()
export class DatabaseController {
  constructor(private readonly dbService: DatabaseService) {}

  @MessagePattern({ cmd: 'get-single-movie' })
  async getSingleMovie() {
    const data = await this.dbService.getRandomOne();
    return data;
  }
}

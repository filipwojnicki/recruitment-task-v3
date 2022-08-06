import { Logger, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/service/database.service';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(private readonly dbService: DatabaseService) {}

  async getData() {
    const MovieData = await this.dbService.getData();
    return MovieData;
  }
}

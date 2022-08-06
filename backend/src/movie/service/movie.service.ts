import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor() {}

  async getData() {
    return '';
  }
}

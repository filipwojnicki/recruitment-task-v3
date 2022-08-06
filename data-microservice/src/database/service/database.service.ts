import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import type { Low, JSONFile } from 'lowdb';
import { MovieData } from '../types/movie-data.type';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db: Low<MovieData>;

  constructor(private lowdb) {}

  async onModuleInit(): Promise<void> {
    await this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    try {
      this.logger.log('Database init');

      const JSONFile: JSONFile<MovieData> = new this.lowdb.JSONFile(
        process.env.DATABASE_FILE_LOCATION,
      );

      this.db = new this.lowdb.Low(JSONFile);
      await this.readData();
    } catch (error) {
      this.logger.error(error?.message ? error.message : JSON.stringify(error));
      throw new Error("Database can't be loaded");
    }
  }

  async readData(): Promise<void> {
    try {
      await this.db.read();
    } catch (error) {
      this.logger.error(error?.message ? error.message : JSON.stringify(error));
      throw new Error("Database can't be read");
    }
  }

  async writeData(): Promise<void> {
    try {
      await this.db.write();
    } catch (error) {
      this.logger.error(error?.message ? error.message : JSON.stringify(error));
      throw new Error("Database can't be write");
    }
  }

  async getData(): Promise<MovieData | null> {
    if (!this.db) {
      await this.readData();
    }

    if (!this.db) {
      throw new Error("Database can't be read");
    }

    if (!this.db.hasOwnProperty('data')) {
      throw new Error("Database can't be read");
    }

    return this.db.data;
  }

  async updateData(data: MovieData): Promise<void> {
    this.db.data = data;
    // this.writeData();
  }
}

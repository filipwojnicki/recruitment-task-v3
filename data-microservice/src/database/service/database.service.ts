import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import type { Low, JSONFile } from 'lowdb';

import { dynamicImport } from '../../common/utils';
import { DatabaseChangedEvent } from '../events/database-changed.event';
import { MovieData } from '../types/movie-data.type';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db: Low<MovieData>;

  constructor(private eventEmitter: EventEmitter2) {}

  async onModuleInit(): Promise<void> {
    await this.initDatabase();
  }

  async initDatabase(): Promise<void> {
    try {
      this.logger.log('Database init');

      const lowdb = await dynamicImport('lowdb');

      const JSONFile: JSONFile<MovieData> = new lowdb.JSONFile(
        process.env.DATABASE_FILE_LOCATION,
      );

      this.db = new lowdb.Low(JSONFile);
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

    const databaseChangedEvent = new DatabaseChangedEvent();
    databaseChangedEvent.name = 'write-file';
    this.eventEmitter.emit('database.changed', databaseChangedEvent);
  }
}

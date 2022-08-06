import type { JobOptions } from 'bull';

export class DatabaseChangedEvent {
  name: string;
  data: any;
  options?: JobOptions;
}

import { FaultType } from '../types';

export class ApiError extends Error {
  fault: FaultType;
  service?: string;

  protected constructor(message: string) {
    super(message);
    this.service = 'api';
    this.name = 'ApiError';
    this.fault = FaultType.INTERNAL;
  }

  override toString(): string {
    return `${this.name}: ${this.message}`;
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      service: this.service,
      message: this.message,
      fault: this.fault,
    });
  }
}

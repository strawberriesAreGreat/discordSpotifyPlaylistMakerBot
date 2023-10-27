import { FaultType } from '../types';

export class ApiError extends Error {
  fault: FaultType;

  protected constructor(message: string) {
    super(message);
    this.name = 'CustomError';
    this.fault = FaultType.INTERNAL;
  }

  override toString(): string {
    return `${this.name}: ${this.message}`;
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      message: this.message,
      fault: this.fault,
    });
  }
}

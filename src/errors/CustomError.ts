import { FaultType } from '../types';

export class ApiError extends Error {
  fault: FaultType;

  protected constructor(message: string) {
    super(message);
    this.name = 'CustomError';
    this.fault = FaultType.INTERNAL;
  }
}

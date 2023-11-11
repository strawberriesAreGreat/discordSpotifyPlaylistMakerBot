import { ApiError } from './ApiErrors';
import { FaultType } from '../types';

export class DatabaseError extends ApiError {
  constructor(message: string) {
    super(message);
    this.service = 'db';
    this.name = 'DatabaseError';
    this.fault = FaultType.INTERNAL;
  }
}

export class UserNotFoundError extends ApiError {
  constructor() {
    super('User not found in DB');
    this.name = 'UserNotFoundError';
    this.fault = FaultType.USER;
  }
}

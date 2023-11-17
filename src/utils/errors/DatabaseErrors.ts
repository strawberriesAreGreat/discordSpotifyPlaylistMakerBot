import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class DatabaseError extends ApiError {
  databaseError?: Error;
  constructor(message: Message, error?: Error) {
    super(message);
    this.name = 'DatabaseError';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
    this.databaseError = error;
  }
}

// TODO: This should be faulttype.INTERNAL, unauthorized user should never be able to reach this point.
// Review and refactor as needed.
export class UserNotFoundError extends DatabaseError {
  constructor(message: Message, error?: Error) {
    super(message, error);
    this.name = 'UserNotFoundError';
    this.service = 'db';
    this.fault = FaultType.USER;
  }
}

export class TokenNotFoundError extends DatabaseError {
  constructor(message: Message, error?: Error) {
    super(message, error);
    this.name = 'TokenNotFoundError';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
  }
}

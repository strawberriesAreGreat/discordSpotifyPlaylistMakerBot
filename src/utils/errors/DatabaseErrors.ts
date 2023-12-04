import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class DatabaseError extends ApiError {
  databaseError?: Error;
  constructor(error?: Error) {
    super();
    this.name = 'DatabaseError';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
    this.databaseError = error;
  }
}

// TODO: This should be faulttype.INTERNAL, unauthorized user should never be able to reach this point.
// Review and refactor as needed.
export class UserNotFoundError extends DatabaseError {
  constructor(error?: Error) {
    super(error ? error : error);
    this.name = 'UserNotFoundError';
    this.service = 'db';
    this.fault = FaultType.USER;
  }
}

export class TokenNotFoundError extends DatabaseError {
  constructor(error?: Error) {
    super(error ? error : error);
    this.name = 'TokenNotFoundError';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
  }
}

export class TokenCreationError extends DatabaseError {
  constructor(error: Error) {
    super(error ? error : error);
    this.name = 'TokenCreationError';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
  }
}

export class SongNotFound extends DatabaseError {
  constructor(error?: Error) {
    super(error ? error : error);
    this.name = 'SongNotFound';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
  }
}

import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class DatabaseError extends ApiError {
  constructor(message: Message) {
    super(message);
    this.name = 'DatabaseError';
    this.service = 'db';
    this.fault = FaultType.INTERNAL;
  }
}

export class UserNotFoundError extends ApiError {
  constructor(message: Message) {
    super(message);
    this.name = 'UserNotFoundError';
    this.service = 'db';
    this.fault = FaultType.USER;
  }
}

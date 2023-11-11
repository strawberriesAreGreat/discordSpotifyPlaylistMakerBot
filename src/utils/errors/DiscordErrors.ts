import { ApiError } from './ApiErrors';
import { FaultType } from '../types';

export class DiscordError extends ApiError {
  constructor(message: string) {
    super(message);
    this.service = 'discord';
    this.name = 'DiscordError';
    this.fault = FaultType.INTERNAL;
  }
}

export class CommandNotFoundError extends ApiError {
  constructor() {
    super('Command not found');
    this.name = 'CommandNotFoundError';
    this.fault = FaultType.USER;
  }
}

import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class DiscordError extends ApiError {
  constructor(command: Message) {
    super(command);
    this.name = 'DiscordError';
    this.service = 'discord';
    this.fault = FaultType.INTERNAL;
  }
}

export class CommandNotFoundError extends ApiError {
  constructor(command: Message) {
    super(command);
    this.name = 'CommandNotFoundError';
    this.service = 'discord';
    this.fault = FaultType.USER;
  }
}

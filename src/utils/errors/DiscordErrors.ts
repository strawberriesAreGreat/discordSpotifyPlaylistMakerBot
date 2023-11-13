import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class DiscordError extends ApiError {
  response: string;
  constructor(command: Message) {
    super(command);
    this.name = 'DiscordError';
    this.service = 'discord';
    this.fault = FaultType.INTERNAL;
    this.response = 'Sorry, something went wrong. Please try again later.';
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

export class UnauthorizedUserError extends ApiError {
  constructor(command: Message) {
    super(command);
    this.name = 'UnauthorizedUserError';
    this.service = 'discord';
    this.fault = FaultType.USER;
  }
}

import { Message } from 'discord.js';
import { FaultType } from '../types';

export class ApiError extends Error {
  fault: FaultType;
  service?: string;
  command?: Message;

  protected constructor(command?: Message) {
    super();
    this.name = 'ApiError';
    this.service = 'api';
    this.fault = FaultType.INTERNAL;
    this.command = command;
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      service: this.service,
      fault: this.fault,
      command: this.command,
      message: this.message,
    });
  }
}

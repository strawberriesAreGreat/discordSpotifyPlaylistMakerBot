import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class SpotifyApiError extends ApiError {
  constructor(command: Message) {
    super(command);
    this.name = 'SpotifyApiError';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}
export class InvalidUrlError extends ApiError {
  constructor() {
    super();
    this.name = 'InvalidUrlError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class UrlParametersNotFoundError extends ApiError {
  constructor() {
    super();
    this.name = 'UrlParametersNotFoundError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}
export class InvalidAuthCodeError extends ApiError {
  constructor() {
    super();
    this.name = 'InvalidAuthCodeError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class AccessTokenFailure extends ApiError {
  constructor() {
    super();
    this.name = 'AccessTokenFailure';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class RefreshTokenFailure extends ApiError {
  constructor() {
    super();
    this.name = 'RefreshTokenFailure';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

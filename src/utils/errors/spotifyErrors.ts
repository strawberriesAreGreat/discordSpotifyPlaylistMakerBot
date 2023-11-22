import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class SpotifyApiError extends ApiError {
  constructor(command?: Message) {
    super(command);
    this.name = 'SpotifyApiError';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}
export class InvalidUrlError extends SpotifyApiError {
  constructor() {
    super();
    this.name = 'InvalidUrlError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class UrlParametersNotFoundError extends SpotifyApiError {
  constructor() {
    super();
    this.name = 'UrlParametersNotFoundError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}
export class InvalidAuthCodeError extends SpotifyApiError {
  constructor() {
    super();
    this.name = 'InvalidAuthCodeError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class AccessTokenFailure extends SpotifyApiError {
  constructor() {
    super();
    this.name = 'AccessTokenFailure';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}

export class UserProfileError extends SpotifyApiError {
  constructor() {
    super();
    this.name = 'UserProfileError';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}

export class RefreshTokenFailure extends SpotifyApiError {
  constructor() {
    super();
    this.name = 'RefreshTokenFailure';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}

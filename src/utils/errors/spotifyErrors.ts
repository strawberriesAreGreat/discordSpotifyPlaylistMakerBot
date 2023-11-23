import { ApiError } from './ApiErrors';
import { FaultType } from '../types';
import { Message } from 'discord.js';

export class SpotifyApiError extends ApiError {
  spotifyApiError?: Error;
  constructor(error?: Error) {
    super();
    this.name = 'SpotifyApiError';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
    this.spotifyApiError = error;
  }
}
export class InvalidUrlError extends SpotifyApiError {
  constructor(error?: Error) {
    super(error);
    this.name = 'InvalidUrlError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class UrlParametersNotFoundError extends SpotifyApiError {
  constructor(error?: Error) {
    super(error);
    this.name = 'UrlParametersNotFoundError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}
export class InvalidAuthCodeError extends SpotifyApiError {
  constructor(error?: Error) {
    super(error);
    this.name = 'InvalidAuthCodeError';
    this.service = 'spotify';
    this.fault = FaultType.USER;
  }
}

export class AccessTokenFailure extends SpotifyApiError {
  constructor(error?: Error) {
    super(error);
    this.name = 'AccessTokenFailure';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}

export class UserProfileError extends SpotifyApiError {
  constructor(error?: Error) {
    super(error);
    this.name = 'UserProfileError';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}

export class RefreshTokenFailure extends SpotifyApiError {
  constructor(error?: Error) {
    super(error);
    this.name = 'RefreshTokenFailure';
    this.service = 'spotify';
    this.fault = FaultType.INTERNAL;
  }
}

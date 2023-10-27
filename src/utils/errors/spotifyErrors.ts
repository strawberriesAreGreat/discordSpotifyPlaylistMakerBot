import { ApiError } from './CustomError';
import { FaultType } from '../types';

export class InvalidUrlError extends ApiError {
  constructor() {
    super('Invalid URL');
    this.name = 'InvalidUrlError';
    this.fault = FaultType.USER;
  }
}

export class UrlParametersNotFoundError extends ApiError {
  constructor() {
    super('URL parameters not found.');
    this.name = 'UrlParametersNotFoundError';
    this.fault = FaultType.USER;
  }
}
export class InvalidAuthCodeError extends ApiError {
  constructor() {
    super('Invalid authorization code.');
    this.name = 'InvalidAuthCodeError';
    this.fault = FaultType.USER;
  }
}

export class AccessTokenFailure extends ApiError {
  constructor() {
    super('Failed to get access token.');
    this.name = 'AccessTokenFailure';
    this.fault = FaultType.USER;
  }
}
export class RefreshTokenFailure extends ApiError {
  constructor() {
    super('Failed to refresh token.');
    this.name = 'RefreshTokenFailure';
    this.fault = FaultType.USER;
  }
}
export class SpotifyApiError extends ApiError {
  constructor() {
    super('Spotify API error.');
    this.name = 'SpotifyApiError';
    this.fault = FaultType.USER;
  }
}

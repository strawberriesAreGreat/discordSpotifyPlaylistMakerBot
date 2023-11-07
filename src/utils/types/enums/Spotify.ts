import { EncryptedString } from './EncryptedString';

type RequestState = EncryptedString;
type AccessToken = EncryptedString;
type RefreshToken = EncryptedString;
type RefreshTokenExpiresIn = number;
type RefreshTokenExpiry = Date;
type Scope = string;
type ResponseCode = string;

export type {
  RequestState,
  RefreshToken,
  AccessToken,
  RefreshTokenExpiresIn,
  Scope,
  RefreshTokenExpiry,
  ResponseCode,
};

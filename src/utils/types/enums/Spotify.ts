import { EncryptedString } from './EncryptedString';

type SpotifyState = EncryptedString;
type AccessToken = EncryptedString;
type RefreshToken = EncryptedString;
type RefreshTokenExpiresIn = number;
type RefreshTokenExpiry = Date;
type Scope = string;
type SpotifyCode = string;

export type {
  SpotifyState,
  RefreshToken,
  AccessToken,
  RefreshTokenExpiresIn,
  Scope,
  RefreshTokenExpiry,
  SpotifyCode,
};

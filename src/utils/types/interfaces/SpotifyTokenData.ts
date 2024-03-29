// utils/types/SpotifyTokenData.ts

import {
  Scope,
  AccessToken,
  RefreshTokenExpiresIn,
  RefreshToken,
  SpotifyCode,
  RefreshTokenExpiry,
  SpotifyState,
  UserUri,
} from '../enums';

export interface SpotifyTokenData {
  scope: Scope;
  code?: SpotifyCode;
  state?: SpotifyState;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  tokenExpiry: RefreshTokenExpiresIn;
  tokenExpiryTime: RefreshTokenExpiry;
  tokenType: string;
  userUri?: UserUri;
}

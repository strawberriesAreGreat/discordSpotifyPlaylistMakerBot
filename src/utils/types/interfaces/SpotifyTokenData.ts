// utils/types/SpotifyTokenData.ts

import {
  Scope,
  AccessToken,
  RefreshTokenExpiresIn,
  RefreshToken,
  ResponseCode,
  RefreshTokenExpiry,
  RequestState,
} from '../enums';

export interface SpotifyTokenData {
  scope?: Scope;
  code?: ResponseCode;
  requestState?: RequestState;
  access_token?: AccessToken;
  refresh_token?: RefreshToken;
  expires_in?: RefreshTokenExpiresIn;
  TokenExpiry?: RefreshTokenExpiry;
}
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
  state?: RequestState;
  accessToken?: AccessToken;
  refreshToken?: RefreshToken;
  tokenExpiry?: RefreshTokenExpiresIn;
  TokenExpiry?: RefreshTokenExpiry;
  tokenType?: string;
}

import {
  AccessToken,
  RefreshToken,
  RefreshTokenExpiry,
  Scope,
} from '../../utils/types';

export class SpotifyTokens {
  public id!: number;
  public accessToken!: AccessToken;
  public scope!: Scope;
  public refreshToken!: RefreshToken;
  public tokenExpiry!: RefreshTokenExpiry;
  public tokenExpiryTimestamp!: Date;
  public discordUserId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  discordId: any;

  static init = jest.fn();
  static findOne = jest.fn();
  static create = jest.fn();
  static findAll = jest.fn();
  static update = jest.fn();
}

export default SpotifyTokens;

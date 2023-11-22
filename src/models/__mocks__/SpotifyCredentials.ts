import {
  AccessToken,
  RefreshToken,
  RefreshTokenExpiry,
  Scope,
  UserUri,
} from '../../utils/types';

export class SpotifyCredentials {
  public id!: number;
  public accessToken!: AccessToken;
  public scope!: Scope;
  public refreshToken!: RefreshToken;
  public tokenExpiry!: RefreshTokenExpiry;
  public tokenExpiryTimestamp!: Date;
  public userId!: string;
  public userUri!: UserUri;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  discordId: any;

  static init = jest.fn();
  static findOne = jest.fn();
  static create = jest.fn();
  static findAll = jest.fn();
  static update = jest.fn();
  static upsert = jest.fn();
}

export default SpotifyCredentials;

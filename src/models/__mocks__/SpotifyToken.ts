import {
  AccessToken,
  RefreshToken,
  RefreshTokenExpiry,
  Scope,
} from '../../utils/types';

export class SpotifyToken {
  public id!: number;
  public access_token!: AccessToken;
  public scope!: Scope;
  public refresh_token!: RefreshToken;
  public token_expiry!: RefreshTokenExpiry;
  public token_expiry_timestamp!: Date;
  public discord_user_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  discordId: any;

  static init = jest.fn();
  static findOne = jest.fn();
  static create = jest.fn();
  static findAll = jest.fn();
  static update = jest.fn();
}

export default SpotifyToken;

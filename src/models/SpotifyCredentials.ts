import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import DiscordUsers from './DiscordUsers';
import {
  AccessToken,
  HashedString,
  RefreshToken,
  RefreshTokenExpiry,
  Scope,
  UserUri,
} from '../utils/types';

export class SpotifyCredentials extends Model {
  public id!: number;
  public accessToken!: AccessToken;
  public scope!: Scope;
  public refreshToken!: RefreshToken;
  public tokenExpiry!: RefreshTokenExpiry;
  public tokenExpiryTimestamp!: Date;
  public userId!: number;
  public userUri!: UserUri;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SpotifyCredentials.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accessToken: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    tokenExpiry: {
      type: DataTypes.INTEGER, // "The time period (in seconds) for which the access token is valid."
      allowNull: false,
    },
    tokenExpiryTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DiscordUsers,
        key: 'id',
      },
    },
    userUri: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'SpotifyCredentials',
  }
);

DiscordUsers.hasOne(SpotifyCredentials, {
  foreignKey: 'userId',
});

export default SpotifyCredentials;

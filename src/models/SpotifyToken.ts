import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db';
import DiscordUser from './DiscordUser';
import {
  AccessToken,
  RefreshToken,
  RefreshTokenExpiry,
  Scope,
} from '../utils/types';

export class SpotifyToken extends Model {
  public id!: number;
  public access_token!: AccessToken;
  public scope!: Scope;
  public refresh_token!: RefreshToken;
  public token_expiry!: RefreshTokenExpiry;
  public token_expiry_timestamp!: Date;
  public discord_user_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SpotifyToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    access_token: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    token_expiry: {
      type: DataTypes.INTEGER, // "The time period (in seconds) for which the access token is valid."
      allowNull: false,
    },
    token_expiry_timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    discord_user_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      references: {
        model: DiscordUser,
        key: 'discordId',
      },
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
    tableName: 'SpotifyToken',
  }
);

DiscordUser.hasOne(SpotifyToken, {
  foreignKey: 'discord_user_id',
});

export default SpotifyToken;

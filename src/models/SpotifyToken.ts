import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db';
import { DiscordUser } from './DiscordUser';
import {
  AccessToken,
  RefreshTokenExpiresIn,
  RefreshToken,
  Scope,
  RefreshTokenExpiry,
} from '../utils/types';

export class SpotifyToken extends Model {
  public access_token!: AccessToken;
  public refresh_token!: RefreshToken;
  public scope!: Scope;
  public expires_in!: RefreshTokenExpiresIn;
  public token_expiry!: RefreshTokenExpiry;
}

SpotifyToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    token_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_in: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'spotify_tokens',
  }
);

SpotifyToken.belongsTo(DiscordUser, { foreignKey: 'discordId' });
SpotifyToken.sync();

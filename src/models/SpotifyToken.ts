import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import DiscordUser from './DiscordUsers';
import {
  AccessToken,
  HashedString,
  RefreshToken,
  RefreshTokenExpiry,
  Scope,
} from '../utils/types';

export class SpotifyToken extends Model {
  public id!: number;
  public accessToken!: AccessToken;
  public scope!: Scope;
  public refreshToken!: RefreshToken;
  public tokenExpiry!: RefreshTokenExpiry;
  public tokenExpiryTimestamp!: Date;
  public discordUserId!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async getAccessToken(
    discordId: HashedString
  ): Promise<AccessToken | null> {
    const token = await SpotifyToken.findOne({
      where: { discordUserId: discordId },
    });
    if (token) {
      return token.accessToken;
    }
    return null;
  }

  public static async getRefreshToken(
    discordId: HashedString
  ): Promise<RefreshToken | null> {
    const token = await SpotifyToken.findOne({
      where: { discordUserId: discordId },
    });
    if (token) {
      return token.refreshToken;
    }
    return null;
  }

  public static async updateRefreshToken(
    discordId: HashedString,
    refreshToken: RefreshToken
  ): Promise<void> {
    await SpotifyToken.update(
      { refreshToken: refreshToken },
      { where: { discordUserId: discordId } }
    );
  }

  public static async updateAccessToken(
    discordId: HashedString,
    accessToken: AccessToken
  ): Promise<void> {
    await SpotifyToken.update(
      { accessToken: accessToken },
      { where: { discordUserId: discordId } }
    );
  }
}

SpotifyToken.init(
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
    discordUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DiscordUser,
        key: 'id',
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
  foreignKey: 'discordUserID',
});

export default SpotifyToken;

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db';
import { DiscordUser } from './DiscordUser';

export class SpotifyToken extends Model {
  public access_token!: string;
  public token_type!: string;
  public scope!: string;
  public expires_in!: number;
  public refresh_token!: string;
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
    token_type: {
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

SpotifyToken.belongsTo(DiscordUser, { foreignKey: 'id' });

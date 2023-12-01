import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db';
import DiscordUsers from '../DiscordUsers/DiscordUsers';
import { DiscordChannels } from '../discordChannels/DiscordChannels';
import { EncryptedString, HashedString } from '../../../../utils/types';

export class DiscordChannelPlaylists extends Model {
  public id!: number;
  public channelId!: number;
  public userId!: number;
  public spotifyPlaylistHash!: EncryptedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordChannelPlaylists.init(
  {
    id: {
      primaryKey: true, // TODO: unable to drop this from partial primary key... is it a bug? see if it's related to https://github.com/sequelize/sequelize/pull/14687
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    channelId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DiscordChannels',
        key: 'id',
      },
    },
    userId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DiscordUsers',
        key: 'id',
      },
    },
    spotifyPlaylistHash: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
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
    modelName: 'DiscordChannelPlaylists',
  }
);

DiscordUsers.hasMany(DiscordChannelPlaylists, {
  foreignKey: 'userId',
  sourceKey: 'id',
});

DiscordChannels.hasMany(DiscordChannelPlaylists, {
  foreignKey: 'channelId',
  sourceKey: 'id',
});

export default DiscordChannelPlaylists;

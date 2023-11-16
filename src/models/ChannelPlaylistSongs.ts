import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { SpotifySongs } from './SpotifySongs';
import { DiscordChannelPlaylists } from './ChannelPlaylists';

export class ChannelPlaylistSongs extends Model {
  public id!: number;
  public channelPlaylistId!: number;
  public songId!: number;
  public addedByUser!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChannelPlaylistSongs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    channelPlaylistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ChannelPlaylists',
        key: 'id',
      },
    },
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SpotifySongs',
        key: 'id',
      },
    },
    addedByUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DiscordUsers',
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
    modelName: 'ChannelPlaylistSongs',
  }
);

SpotifySongs.hasMany(ChannelPlaylistSongs, {
  foreignKey: 'songId',
});
DiscordChannelPlaylists.hasMany(ChannelPlaylistSongs, {
  foreignKey: 'channelPlaylistId',
});

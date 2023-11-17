import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { SpotifySongs } from './SpotifySongs';
import { DiscordChannelPlaylists } from './ChannelPlaylists';

export class ChannelPlaylistSongs extends Model {
  public id!: number;
  public channelPlaylistId!: number;
  public songId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async findOrCreateByChannelPlaylistIdandSongId(
    channelPlaylistId: number,
    songId: number
  ) {
    const [channelPlaylistSong, created] =
      await ChannelPlaylistSongs.findOrCreate({
        where: {
          channelPlaylistId,
          songId,
        },
      });

    return channelPlaylistSong;
  }
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

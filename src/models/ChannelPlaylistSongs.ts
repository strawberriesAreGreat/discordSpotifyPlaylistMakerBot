import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { SpotifySongs } from './SpotifySongs';
import { DiscordChannelPlaylists } from './DiscordChannelPlaylists';

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
      primaryKey: true, // TODO: unable to drop this from partial primary key... is it a bug? see if it's related to https://github.com/sequelize/sequelize/pull/14687
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    channelPlaylistId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ChannelPlaylists',
        key: 'id',
      },
    },
    songId: {
      primaryKey: true,
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
  sourceKey: 'id',
});
DiscordChannelPlaylists.hasMany(ChannelPlaylistSongs, {
  foreignKey: 'channelPlaylistId',
  sourceKey: 'id',
});

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import DiscordUser from './DiscordUsers';
import { DiscordChannel } from './DiscordChannels';

export class DiscordChannelPlaylists extends Model {
  public id!: number;
  public channelId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  findOrCreateByChannelIdandUserId(channelId: number, userId: number) {
    return DiscordChannelPlaylists.findOrCreate({
      where: {
        channelId,
        userId,
      },
    });
  }
}

DiscordChannelPlaylists.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    channelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DiscordChannels',
        key: 'id',
      },
    },
    userId: {
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
    modelName: 'DiscordChannelPlaylists',
  }
);

DiscordUser.hasMany(DiscordChannelPlaylists, {
  foreignKey: 'userId',
});

DiscordChannel.hasMany(DiscordChannelPlaylists, {
  foreignKey: 'channelId',
});

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { DiscordServer } from './DiscordServer';

export class DiscordChannel extends Model {
  public id!: number;
  public channelId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordChannel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    serverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DiscordServers',
        key: 'id',
      },
    },
    channelId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        is: /^[a-f0-9]+$/i,
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
    modelName: 'DiscordServer',
  }
);

DiscordServer.hasMany(DiscordChannel, {
  foreignKey: 'serverId',
});

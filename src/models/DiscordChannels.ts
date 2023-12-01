import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { DiscordServers } from './DiscordServers';
import { HashedString } from '../utils/types';
export class DiscordChannels extends Model {
  public id!: number;
  public channelHash!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordChannels.init(
  {
    id: {
      primaryKey: true, // TODO: unable to drop this from partial primary key... is it a bug? see if it's related to https://github.com/sequelize/sequelize/pull/14687
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    serverId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DiscordServers',
        key: 'id',
      },
    },
    channelHash: {
      primaryKey: true,
      type: DataTypes.STRING(128),
      allowNull: false,
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
    modelName: 'DiscordChannels',
  }
);

DiscordServers.hasMany(DiscordChannels, {
  foreignKey: 'serverId',
  sourceKey: 'id',
});

export default DiscordChannels;

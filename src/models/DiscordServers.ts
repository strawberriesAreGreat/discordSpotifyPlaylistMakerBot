import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { HashedString } from '../utils/types';

export class DiscordServers extends Model {
  public id!: number;
  public serverHash!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordServers.init(
  {
    id: {
      primaryKey: true, // TODO: unable to drop this from partial primary key... is it a bug? see if it's related to https://github.com/sequelize/sequelize/pull/14687
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    serverHash: {
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
    modelName: 'DiscordServers',
  }
);

export default DiscordServers;

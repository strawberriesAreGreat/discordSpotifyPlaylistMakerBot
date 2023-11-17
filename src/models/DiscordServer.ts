import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { HashedString } from '../utils/types';

export class DiscordServer extends Model {
  public id!: number;
  public serverId!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async findOrCreateByServerId(serverId: HashedString) {
    const [server, created] = await DiscordServer.findOrCreate({
      where: {
        serverId,
      },
    });

    return server;
  }
}

DiscordServer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    serverId: {
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

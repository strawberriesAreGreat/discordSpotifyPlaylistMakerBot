import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { DiscordId } from '../utils/types';

export class DiscordUsers extends Model {
  public id!: number;
  public discordId!: DiscordId;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async findOrCreateByDiscordId(
    discordId: DiscordId
  ): Promise<DiscordUsers> {
    const [user, created] = await DiscordUsers.findOrCreate({
      where: {
        discordId,
      },
    });

    return user;
  }
}

DiscordUsers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    discordId: {
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
    modelName: 'DiscordUsers',
  }
);

export default DiscordUsers;

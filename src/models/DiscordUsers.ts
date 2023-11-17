import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { HashedString } from '../utils/types';

export class DiscordUser extends Model {
  public id!: number;
  public discordId!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static async findOrCreateByDiscordId(
    discordId: HashedString
  ): Promise<DiscordUser> {
    const [user, created] = await DiscordUser.findOrCreate({
      where: {
        discordId,
      },
    });

    return user;
  }
}

DiscordUser.init(
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
    modelName: 'DiscordUser',
  }
);

export default DiscordUser;

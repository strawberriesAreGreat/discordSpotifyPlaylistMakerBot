import { DataTypes, Model } from 'sequelize';
import { sequelize } from './db';

export class DiscordUser extends Model {
  public discordId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordUser.init(
  {
    discordId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        is: /^\d+$/,
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

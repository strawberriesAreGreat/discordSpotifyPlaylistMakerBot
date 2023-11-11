import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';
import { HashedString } from '../utils/types';

export class DiscordUser extends Model {
  public discordId!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordUser.init(
  {
    discordId: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
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

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db';
import { DiscordId } from '../../../../utils/types';

export class DiscordUsers extends Model {
  public id!: number;
  public userHash!: DiscordId;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DiscordUsers.init(
  {
    id: {
      primaryKey: true, // TODO: unable to drop this from partial primary key... is it a bug? see if it's related to https://github.com/sequelize/sequelize/pull/14687
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    userHash: {
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
    modelName: 'DiscordUsers',
  }
);

export default DiscordUsers;

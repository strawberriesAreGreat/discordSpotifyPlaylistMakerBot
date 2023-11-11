import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../middleware/db/db';
import { HashedString } from '../../utils/types';

export class DiscordUser extends Model {
  public discordId!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static init = jest.fn();
  static findOne = jest.fn();
  static create = jest.fn();
}

export default DiscordUser;

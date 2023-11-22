import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../middleware/db/db';
import { HashedString } from '../../utils/types';

export class DiscordUsers extends Model {
  public id!: number;
  public discordUserId!: HashedString;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static init = jest.fn();
  static findOne = jest.fn();
  static create = jest.fn();
  static upsert = jest.fn();
}

export default DiscordUsers;

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db';

export class SpotifySongs extends Model {
  public id!: number;
  public songURIs!: string;
  public count!: number;
  public albumURI!: string;
  public artistURI!: string;
  public availableMarkets!: string;
  public discNumber!: number;
  public durationMS!: number;
  public explicit!: boolean;
  public externalIds!: string; // isc, ean, upc
  public externalUrls!: string; // spotify
  public href!: string;
  public isLocal!: boolean;
  public isPlayable!: boolean;
  public linkedFrom!: string; // spotify
  public restrictions!: string; // reason, market
  public name!: string;
  public popularity!: number;
  public previewUrl!: string;
  public trackNumber!: number;
  public danceability!: number;
  public duration_ms!: number;
  public energy!: number;
  public instrumentalness!: number;
  public key!: number;
  public liveness!: number;
  public loudness!: number;
  public mode!: number;
  public speechiness!: number;
  public valence!: number;
  public acousticness!: number;
  public time_signature!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
SpotifySongs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    uri: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
      unique: true,
      validate: {
        is: /^[a-f0-9]+$/i,
      },
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tempo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    danceability: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    energy: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    instrumentalness: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    key: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    liveness: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    loudness: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speechiness: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    valence: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    acousticness: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    time_signature: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'SpotifySongs',
  }
);

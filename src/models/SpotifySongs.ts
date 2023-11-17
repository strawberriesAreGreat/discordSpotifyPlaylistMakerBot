import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../middleware/db/db';

export class SpotifySongs extends Model {
  public id!: number;
  public songURI!: string;
  public count!: number;
  public tempo!: number;
  public popularity!: number;
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

  public static async findOrCreateBySongURI(songURI: string) {
    const [song, created] = await SpotifySongs.findOrCreate({
      where: {
        uri: songURI,
      },
    });

    return song;
  }

  public static async getSong(songURI: string): Promise<SpotifySongs | null> {
    return await SpotifySongs.findOne({
      where: {
        uri: songURI,
      },
    });
  }

  public static async getSongById(
    songId: number
  ): Promise<SpotifySongs | null> {
    return await SpotifySongs.findOne({
      where: {
        id: songId,
      },
    });
  }
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

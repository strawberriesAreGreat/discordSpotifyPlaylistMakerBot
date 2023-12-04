import * as TE from 'fp-ts/TaskEither';
import { DatabaseError, SongNotFound } from '../../../../utils/errors';
import { SpotifySong } from '../../../../utils/types/enums';
import { SpotifySongs } from './SpotifySongs';

export const getSpotifySong = (SpotifySong: SpotifySong) =>
  TE.tryCatch<Error, SpotifySongs>(
    async () => {
      const song = await SpotifySongs.findOne({
        where: { songURI: SpotifySong.songURI },
      });
      return song != null ? song : Promise.reject(new SongNotFound());
    },
    (error) => new DatabaseError(error as Error)
  );

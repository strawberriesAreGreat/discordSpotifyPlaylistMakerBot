import * as TE from 'fp-ts/TaskEither';
import { DatabaseError, SongNotFound } from '../../../../utils/errors';
import { SpotifySong } from '../../../../utils/types/enums';
import { SpotifySongs } from './SpotifySongs';

export const addSpotifySong = (newSong: SpotifySong) =>
  TE.tryCatch<Error, SpotifySongs>(
    async () => {
      const song = await SpotifySongs.create({
        songURI: newSong.songURI,
        count: newSong.count,
        albumURI: newSong.albumURI,
        artistURI: newSong.artistURI,
        availableMarkets: newSong.availableMarkets,
        discNumber: newSong.discNumber,
        durationMS: newSong.durationMS,
        explicit: newSong.explicit,
        externalIds: newSong.externalIds,
        externalUrls: newSong.externalUrls,
        href: newSong.href,
        isLocal: newSong.isLocal,
        isPlayable: newSong.isPlayable,
        linkedFrom: newSong.linkedFrom,
        restrictions: newSong.restrictions,
        name: newSong.name,
        popularity: newSong.popularity,
        previewUrl: newSong.previewUrl,
        trackNumber: newSong.trackNumber,
        danceability: newSong.danceability,
        duration_ms: newSong.duration_ms,
        energy: newSong.energy,
        instrumentalness: newSong.instrumentalness,
        key: newSong.key,
        liveness: newSong.liveness,
        loudness: newSong.loudness,
        mode: newSong.mode,
        speechiness: newSong.speechiness,
        valence: newSong.valence,
        acousticness: newSong.acousticness,
        time_signature: newSong.time_signature,
      });
      return song != null ? song : Promise.reject(new SongNotFound());
    },
    (error) => new DatabaseError(error as Error)
  );

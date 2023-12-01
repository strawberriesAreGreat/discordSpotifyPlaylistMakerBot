import * as TE from 'fp-ts/TaskEither';
import { DatabaseError } from '../../../../utils/errors';
import { EncryptedString } from '../../../../utils/types';
import { DiscordChannelPlaylists } from './DiscordChannelPlaylists';

export const upsertChannelPlaylist = (
  channelId: number,
  userId: number,
  spotifyPlaylistHash: EncryptedString
) =>
  TE.tryCatch<Error, DiscordChannelPlaylists>(
    async () => {
      const [channelPlaylist, created] =
        await DiscordChannelPlaylists.findOrCreate({
          where: {
            channelId: channelId,
            userId: userId,
            spotifyPlaylistHash: spotifyPlaylistHash,
          },
        });
      return channelPlaylist;
    },
    (error) => new DatabaseError(error as Error)
  );

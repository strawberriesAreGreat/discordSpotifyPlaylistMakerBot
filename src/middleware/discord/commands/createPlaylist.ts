import { Message } from 'discord.js';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import { DiscordUsers, SpotifyCredentials } from '../../db/models';
import { encryptString, hashDiscordId } from '../../../services';
import {
  PlaylistCreationFailure,
  SpotifyApiError,
} from '../../../utils/errors';
import { createPlaylistClient } from '../../spotify/services';
import { HashedString } from '../../../utils/types';
import {
  upsertServer,
  upsertChannel,
  findUser,
  upsertChannelPlaylist,
} from '../../db/models';

export async function createPlaylist(
  spotifyCredentials: SpotifyCredentials,
  message: Message
) {
  let serverHash: HashedString = hashDiscordId(message.guild?.id as string);
  let channelHash: HashedString = hashDiscordId(message.channel.id);
  let userHash = hashDiscordId(message.author.id);

  const postSpotifyPlaylist = (
    spotifyCredentials: SpotifyCredentials,
    message: Message
  ) =>
    TE.tryCatch<Error, string>(
      async () => {
        const response = await createPlaylistClient(
          spotifyCredentials,
          message
        );
        return response instanceof Error
          ? new SpotifyApiError(response as Error)
          : response.status !== 201
          ? new PlaylistCreationFailure(
              response.data.code,
              response.data.message
            )
          : response.data.id;
      },
      (error) => new SpotifyApiError(error as Error)
    );

  const handleUpsertOperations = pipe(
    upsertServer(serverHash),
    TE.chain((server) => upsertChannel(server.id, channelHash)),
    TE.chain((channel) =>
      pipe(
        findUser(userHash),
        TE.chain((user) =>
          pipe(
            postSpotifyPlaylist(spotifyCredentials, message),
            TE.chain((spotifyPlaylistId) =>
              upsertChannelPlaylist(
                channel.id,
                user.id,
                encryptString(
                  spotifyPlaylistId as string,
                  process.env.ENCRYPTION_SECRET as string
                )
              )
            )
          )
        )
      )
    ),
    TE.fold(
      (error) => {
        message.react('😢');
        return TE.left(error);
      },
      (result) => {
        message.react('🐧');
        return TE.right(result);
      }
    )
  );

  handleUpsertOperations();
}

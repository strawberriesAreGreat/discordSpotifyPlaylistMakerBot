import { Message } from 'discord.js';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import { DiscordUsers, SpotifyCredentials } from '../../../models';
import { encryptString, hashDiscordId } from '../../../services';
import {
  PlaylistCreationFailure,
  SpotifyApiError,
  UserNotFoundError,
} from '../../../utils/errors';
import { createPlaylistClient } from '../../spotify/services';
import {
  DiscordChannelPlaylists,
  DiscordServers,
  DiscordChannels,
} from '../../../models/';
import { DatabaseError } from '../../../utils/errors';
import { EncryptedString, HashedString } from '../../../utils/types';
import { sequenceT } from 'fp-ts/lib/Apply';

export async function createPlaylist(
  spotifyCredentials: SpotifyCredentials,
  message: Message
) {
  let serverHash: HashedString = hashDiscordId(message.guild?.id as string);
  let channelHash: HashedString = hashDiscordId(message.channel.id);
  let userHash = hashDiscordId(message.author.id);

  const upsertServer = (serverID: HashedString) =>
    TE.tryCatch<Error, DiscordServers>(
      async () => {
        const [server, created] = await DiscordServers.findOrCreate({
          where: { serverHash: serverID },
        });
        return server;
      },
      (error) => new DatabaseError(error as Error)
    );

  const upsertChannel = (serverId: number, channel: string) =>
    TE.tryCatch<Error, DiscordChannels>(
      async () => {
        const [channelEntry, created] = await DiscordChannels.findOrCreate({
          where: { serverId: serverId, channelHash: channel },
        });
        return channelEntry;
      },
      (error) => new DatabaseError(error as Error)
    );

  const findUser = (user: HashedString) =>
    TE.tryCatch<Error, DiscordUsers>(
      async () => {
        const userEntry = await DiscordUsers.findOne({
          where: { userHash: user },
        });
        return userEntry != null
          ? userEntry
          : Promise.reject(new UserNotFoundError());
      },
      (error) => new DatabaseError(error as Error)
    );

  const upsertChannelPlaylist = (
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

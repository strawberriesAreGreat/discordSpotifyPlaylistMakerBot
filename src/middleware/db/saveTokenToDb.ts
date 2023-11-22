import * as TE from 'fp-ts/TaskEither';
import {
  DiscordId,
  EncryptedString,
  SpotifyTokenData,
} from '../../utils/types';
import { decryptString, hashDiscordId } from '../../services';
import DiscordUsers from '../../models/DiscordUsers';
import { pipe } from 'fp-ts/function';
import SpotifyCredentials from '../../models/SpotifyCredentials';
import { TokenCreationError, UserNotFoundError } from '../../utils/errors';
import { DatabaseError } from '../../utils/errors';

export function saveTokenDataToDb(
  spotifyData: SpotifyTokenData,
  discordUserId?: DiscordId
): TE.TaskEither<Error, SpotifyCredentials> {
  let secret: string = process.env.ENCRYPTION_SECRET as string;
  const scope: string = spotifyData.scope;
  const accessToken = spotifyData.accessToken;
  const refreshToken = spotifyData.refreshToken;
  const tokenExpiry = spotifyData.tokenExpiry;
  const tokenExpiryTimestamp = spotifyData.tokenExpiryTime;
  const tokenType = spotifyData.tokenType;
  const userUri = spotifyData.userUri;

  if (!discordUserId && spotifyData.state)
    discordUserId = hashDiscordId(
      decryptString(spotifyData.state, secret)
    ) as DiscordId;

  if (!discordUserId) {
    return TE.left(
      new Error('No Discord User ID or spotifyState response provided')
    );
  }

  return pipe(
    TE.tryCatch(
      () =>
        DiscordUsers.upsert({
          discordId: discordUserId,
        }),
      (err) => new DatabaseError(err as Error)
    ),
    TE.chain(([user, _]) => TE.right(user)),
    TE.chain((user) =>
      TE.tryCatch(
        () =>
          SpotifyCredentials.upsert({
            userId: user.id, // Use the ID from the DiscordUser
            accessToken: accessToken,
            refreshToken: refreshToken,
            scope: scope,
            tokenExpiry: tokenExpiry,
            tokenExpiryTimestamp: tokenExpiryTimestamp,
            tokenType: tokenType,
            userUri: userUri,
          }),
        (err) => new TokenCreationError(err as Error) as Error
      )
    ),
    TE.chain(([spotifyToken, _]) => TE.right(spotifyToken))
  );
}

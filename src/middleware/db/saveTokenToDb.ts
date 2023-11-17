import * as TE from 'fp-ts/TaskEither';
import {
  DiscordId,
  EncryptedString,
  SpotifyTokenData,
} from '../../utils/types';
import { decryptString, hashDiscordId } from '../../services';
import DiscordUsers from '../../models/DiscordUsers';
import { pipe } from 'fp-ts/function';
import SpotifyTokens from '../../models/SpotifyTokens';
import { TokenCreationError, DatabaseError } from '../../utils/errors';

export function saveTokenDataToDb(
  spotifyData: SpotifyTokenData,
  discordId?: DiscordId
): TE.TaskEither<Error, void> {
  let secret: string = process.env.ENCRYPTION_SECRET as string;
  const token = spotifyData.accessToken;
  const refreshToken = spotifyData.refreshToken;
  const scope: string = spotifyData.scope as string;
  const tokenExpiry = spotifyData.tokenExpiry as number;
  const tokenExpiryTimestamp = new Date(Date.now() + tokenExpiry * 1000);
  let discordUserID = discordId
    ? discordId
    : hashDiscordId(
        decryptString(spotifyData.state as EncryptedString, secret)
      );

  if (discordUserID === undefined) {
    throw new Error('Failed to get discordUserID');
  }

  return pipe(
    TE.tryCatch(
      () =>
        DiscordUsers.findOne({
          where: {
            discordId: discordUserID,
          },
        }),
      (err) => new Error(`Failed to find DiscordUser: ${err}`)
    ),
    TE.chain((user) =>
      user
        ? TE.right(user)
        : TE.tryCatch(
            () =>
              DiscordUsers.create({
                discordId: discordUserID,
              }),
            (err) => new Error(`Failed to create DiscordUser: ${err}`)
          )
    ),
    TE.chain((user) =>
      TE.tryCatch(
        async () => {
          SpotifyTokens.upsert({
            discordUserId: user,
            accessToken: token,
            refreshToken: refreshToken,
            scope: scope,
            tokenExpiry: tokenExpiry,
            tokenExpiryTimestamp: tokenExpiryTimestamp,
          })
            .then(([SpotifyToken, _]) => {
              TE.right(SpotifyToken);
            })
            .catch((error) => {
              TE.left(new TokenCreationError(error));
            });
        },
        (err) => new Error(`Failed to create SpotifyToken: ${err}`)
      )
    )
  );
}

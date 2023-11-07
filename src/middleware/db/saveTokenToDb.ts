import * as TE from 'fp-ts/TaskEither';
import {
  DiscordId,
  EncryptedString,
  SpotifyTokenData,
} from '../../utils/types';
import { decryptString, hashDiscordId } from '../../services';
import DiscordUser from '../../models/DiscordUser';
import { pipe } from 'fp-ts/function';
import SpotifyToken from '../../models/SpotifyToken';

export function saveTokenDataToDb(
  spotifyData: SpotifyTokenData
): TE.TaskEither<Error, void> {
  let secret: string = process.env.ENCRYPTION_SECRET as string;
  const discordUserID: DiscordId = hashDiscordId(
    decryptString(spotifyData.state as EncryptedString, secret)
  );
  const token = spotifyData.access_token;
  const refreshToken = spotifyData.refresh_token;
  const scope: string = spotifyData.scope as string;
  const tokenExpiry = spotifyData.expires_in as number;
  const tokenExpiryTimestamp = new Date(Date.now() + tokenExpiry * 1000);

  return pipe(
    TE.tryCatch(
      () =>
        DiscordUser.findOne({
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
              DiscordUser.create({
                discordId: discordUserID,
              }),
            (err) => new Error(`Failed to create DiscordUser: ${err}`)
          )
    ),
    TE.chain((user) =>
      TE.tryCatch(
        () =>
          SpotifyToken.findOne({
            where: {
              discord_user_id: user.discordId,
            },
          }),
        (err) => new Error(`Failed to find SpotifyToken: ${err}`)
      )
    ),
    TE.chain((spotifyToken) =>
      TE.tryCatch(
        async () => {
          SpotifyToken.update(
            {
              access_token: token,
              refresh_token: refreshToken,
              scope: scope,
              token_expiry: tokenExpiry,
              token_expiry_timestamp: tokenExpiryTimestamp,
            },
            {
              where: {
                discord_user_id: spotifyToken,
              },
            }
          );
          return spotifyToken;
        },
        (err) => new Error(`Failed to update a SpotifyToken: ${err}`)
      )
    ),
    TE.chain((spotifyToken) =>
      spotifyToken
        ? TE.right(spotifyToken)
        : TE.tryCatch(
            () =>
              SpotifyToken.create({
                access_token: token,
                refresh_token: refreshToken,
                scope: scope,
                token_expiry: tokenExpiry,
                token_expiry_timestamp: tokenExpiryTimestamp,
                discord_user_id: discordUserID,
              }),
            (err) => new Error(`Failed to create SpotifyToken: ${err}`)
          )
    ),
    TE.map(() => undefined)
  );
}

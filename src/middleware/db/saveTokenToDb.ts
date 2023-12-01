import * as TE from 'fp-ts/TaskEither';
import { DiscordId, SpotifyTokenData } from '../../utils/types';
import { decryptString, hashDiscordId } from '../../services';
import DiscordUsers from './models/DiscordUsers/DiscordUsers';
import { pipe } from 'fp-ts/function';
import SpotifyCredentials from './models/spotifyCredentials/SpotifyCredentials';
import { TokenCreationError } from '../../utils/errors';
import { DatabaseError } from '../../utils/errors';

//TODO: edit function, its bad that discordUserId is optional and that this function has 2 input cases
// 1. user is provded
// 2. user is created
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

  const updateCredentials = (user: DiscordUsers) =>
    SpotifyCredentials.update(
      {
        accessToken: accessToken,
        ...(refreshToken ? { refreshToken: refreshToken } : {}),
        scope: scope,
        tokenExpiry: tokenExpiry,
        tokenExpiryTimestamp: tokenExpiryTimestamp,
        tokenType: tokenType,
        ...(userUri ? { userUri: userUri } : {}),
      },
      { where: { userId: user.id } }
    );

  const createCredentials = (user: DiscordUsers) =>
    SpotifyCredentials.create({
      userId: user.id,
      accessToken: accessToken,
      ...(refreshToken ? { refreshToken: refreshToken } : {}),
      scope: scope,
      tokenExpiry: tokenExpiry,
      tokenExpiryTimestamp: tokenExpiryTimestamp,
      tokenType: tokenType,
      ...(userUri ? { userUri: userUri } : {}),
    });

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
      () => DiscordUsers.findOne({ where: { userHash: discordUserId } }),
      (err) => {
        console.log(err);
        return new DatabaseError(err as Error);
      }
    ),
    TE.chain((user) =>
      user
        ? TE.right(user)
        : TE.tryCatch(
            async () => {
              const [user, created] = await DiscordUsers.upsert({
                userHash: discordUserId,
              });
              return user;
            },
            (err) => {
              console.log(err);
              return new DatabaseError(err as Error);
            }
          )
    ),
    TE.chain((user) =>
      TE.tryCatch(
        () =>
          SpotifyCredentials.update(
            {
              accessToken: accessToken,
              ...(refreshToken ? { refreshToken: refreshToken } : {}),
              scope: scope,
              tokenExpiry: tokenExpiry,
              tokenExpiryTimestamp: tokenExpiryTimestamp,
              tokenType: tokenType,
              ...(userUri ? { userUri: userUri } : {}),
            },
            { where: { userId: user.id } }
          )
            .then(([affectedCount]) => {
              if (affectedCount === 0) {
                return SpotifyCredentials.create({
                  userId: user.id,
                  accessToken: accessToken,
                  ...(refreshToken ? { refreshToken: refreshToken } : {}),
                  scope: scope,
                  tokenExpiry: tokenExpiry,
                  tokenExpiryTimestamp: tokenExpiryTimestamp,
                  tokenType: tokenType,
                  ...(userUri ? { userUri: userUri } : {}),
                });
              }
            })
            .catch((err) => {
              console.log(err);
              new TokenCreationError(err as Error) as Error;
            }),
        (err) => new TokenCreationError(err as Error) as Error
      )
    ),
    TE.fold(
      (err) => TE.left(err),
      (spotifyCredential) => {
        if (!spotifyCredential)
          return TE.left(
            new DatabaseError(
              new Error('No Spotify Credentials inserted into DB')
            )
          );
        return TE.right(spotifyCredential);
      }
    )
  );
}

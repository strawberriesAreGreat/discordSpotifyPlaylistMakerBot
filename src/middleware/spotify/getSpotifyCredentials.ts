import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { AccessToken, DiscordUserData } from '../../utils/types';
import { TokenNotFoundError } from '../../utils/errors';
import {
  refreshAccessToken,
  saveTokenDataToDb,
} from './services/authorization';
import { getUser } from '../db/models/DiscordUsers/getUser';
import { getSpotifyCredential } from '../db/models/spotifyCredentials/getSpotifyCredential';
import { hashDiscordId } from '../../services';
import { SpotifyCredentials } from '../db/models';

export function getSpotifyCredentials(
  discordUserData: DiscordUserData
): TE.TaskEither<Error, SpotifyCredentials> {
  return pipe(
    discordUserData,
    TE.right,
    TE.chain((discordUserData) => getUser(discordUserData.message)),
    TE.chain((discordUser) => getSpotifyCredential(discordUser)),
    TE.chain((spotifyToken) =>
      pipe(
        spotifyToken,
        TE.fromNullable(new TokenNotFoundError()),
        TE.chain((spotifyCredentials) =>
          spotifyCredentials.tokenExpiryTimestamp > new Date()
            ? TE.right(spotifyCredentials)
            : pipe(
                refreshAccessToken(spotifyCredentials.refreshToken),
                TE.chain((refreshedSpotifyTokenData) =>
                  saveTokenDataToDb(
                    refreshedSpotifyTokenData,
                    hashDiscordId(discordUserData.message.author.id)
                  )
                ),
                TE.map((refreshedSpotifyTokenData) => refreshedSpotifyTokenData)
              )
        ),
        TE.map((spotifyCredentials) => spotifyCredentials)
      )
    )
  );
}

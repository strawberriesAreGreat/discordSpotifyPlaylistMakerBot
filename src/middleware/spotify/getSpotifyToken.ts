import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { AccessToken, DiscordUserData } from '../../utils/types';
import { TokenNotFoundError } from '../../utils/errors';
import {
  refreshAccessToken,
  saveTokenDataToDb,
} from './services/authorization';
import { getUser } from '../db/getUser';
import { getToken } from '../db/getToken';
import { hashDiscordId } from '../../services';

export function getSpotifyToken(
  discordUserData: DiscordUserData
): TE.TaskEither<Error, AccessToken> {
  return pipe(
    discordUserData,
    TE.right,
    TE.chain((discordUserData) => getUser(discordUserData.message)),
    TE.chain((discordUser) => getToken(discordUser)),
    TE.chain((spotifyToken) =>
      pipe(
        spotifyToken,
        TE.fromNullable(new TokenNotFoundError()),
        TE.chain((token) =>
          token.tokenExpiryTimestamp > new Date()
            ? TE.right(token.accessToken)
            : pipe(
                refreshAccessToken(token.refreshToken),
                TE.chain((spotifyTokenData) =>
                  saveTokenDataToDb(
                    spotifyTokenData,
                    hashDiscordId(discordUserData.message.author.id)
                  )
                ),
                TE.map(() => token.accessToken)
              )
        ),
        TE.map((accessToken) => accessToken)
      )
    )
  );
}

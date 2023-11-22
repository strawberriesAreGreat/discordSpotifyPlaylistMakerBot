import * as TE from 'fp-ts/TaskEither';
import { SpotifyTokenData } from '../../../../utils/types';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import { AccessTokenFailure } from '../../../../utils/errors';
import { encryptString } from '../../../../services';

export function getUserProfile(): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://api.spotify.com/v1/me',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.SPOTIFY_ACCESS_TOKEN,
    },
  };

  return pipe(
    TE.tryCatch(
      () => axios(authOptions),
      () => new AccessTokenFailure()
    ),
    TE.chain((response) =>
      response.status === 200 && response.data.access_token !== null
        ? TE.right({
            accessToken: encryptString(
              response.data.access_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            refreshToken: encryptString(
              response.data.refresh_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            state: spotifyState,
            scope: response.data.scope,
            tokenExpiry: response.data.expires_in,
            tokenExpiryTime: new Date(
              Date.now() + response.data.expires_in * 1000
            ),
            tokenType: response.data.token_type,
          })
        : TE.left(new AccessTokenFailure())
    )
  );
}

import * as TE from 'fp-ts/TaskEither';
import { RefreshToken, SpotifyTokenData } from '../../../../utils/types';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import { RefreshTokenFailure } from '../../../../utils/errors';
import { decryptString, encryptString } from '../../../../services';

export function refreshAccessToken(
  refreshToken: RefreshToken
): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      refreshToken: decryptString(
        refreshToken,
        process.env.ENCRYPTION_SECRET as string
      ),
      grant_type: 'refresh_token',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ':' +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
    },
  };

  return pipe(
    TE.tryCatch(
      () => axios(authOptions),
      (error) => new RefreshTokenFailure(error as Error)
    ),
    TE.chain((response) =>
      response.status === 200 && response.data.access_token !== null
        ? TE.right({
            scope: response.data.scope,
            accessToken: encryptString(
              response.data.access_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            refreshToken: encryptString(
              response.data.refresh_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            tokenExpiry: response.data.expires_in,
            tokenExpiryTime: new Date(
              Date.now() + response.data.expires_in * 1000
            ),
            tokenType: response.data.token_type,
          })
        : TE.left(new RefreshTokenFailure())
    )
  );
}

import * as TE from 'fp-ts/TaskEither';
import { RefreshToken, SpotifyTokenData } from '../../../../utils/types';
import { pipe } from 'fp-ts/function';
import axios, { AxiosRequestConfig } from 'axios';
import { RefreshTokenFailure } from '../../../../utils/errors';
import { decryptString, encryptString } from '../../../../services';
import qs from 'qs';
import * as O from 'fp-ts/Option';

export function refreshAccessToken(
  refreshToken: RefreshToken
): TE.TaskEither<Error, SpotifyTokenData> {
  const decryptedRefreshToken = decryptString(
    refreshToken,
    process.env.ENCRYPTION_SECRET as string
  );

  if (!decryptedRefreshToken) {
    throw new Error('Failed to decrypt refresh token');
  }

  const authOptions: AxiosRequestConfig<any> = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    data: qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: decryptedRefreshToken,
    }),
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
      (error) => {
        return new RefreshTokenFailure(error as Error);
      }
    ),
    TE.chain((response) => {
      return response.status === 200 && response.data.access_token !== null
        ? TE.right({
            scope: response.data.scope,
            accessToken: encryptString(
              response.data.access_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            refreshToken:
              response.data.refresh_token !== undefined
                ? encryptString(
                    response.data.refresh_token as string,
                    process.env.ENCRYPTION_SECRET as string
                  )
                : refreshToken,
            tokenExpiry: response.data.expires_in,
            tokenExpiryTime: new Date(
              Date.now() + response.data.expires_in * 1000
            ),
            tokenType: response.data.token_type,
          })
        : TE.left(new RefreshTokenFailure());
    })
  );
}

import * as TE from 'fp-ts/TaskEither';
import {
  SpotifyCode,
  SpotifyState,
  SpotifyTokenData,
} from '../../../../utils/types';
import { getRedirect_uri } from '../../../../utils/utils';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import { AccessTokenFailure } from '../../../../utils/errors';
import { encryptString } from '../../../../services';

const REDIRECT_URI = getRedirect_uri();

export function getAccessToken([spotifyCode, spotifyState]: [
  SpotifyCode,
  SpotifyState,
]): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      code: spotifyCode,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
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

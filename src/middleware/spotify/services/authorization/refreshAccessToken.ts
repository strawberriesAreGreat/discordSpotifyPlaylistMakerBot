import * as TE from 'fp-ts/TaskEither';
import { EncryptedString, SpotifyTokenData } from '../../../../utils/types';
import { getRedirect_uri } from '../../../../utils/utils';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import {
  AccessTokenFailure,
  RefreshTokenFailure,
} from '../../../../utils/errors';
import { decryptString, encryptString } from '../../../../services';

export function refreshAccessToken(
  spotifyData: SpotifyTokenData
): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params: {
      refresh_token: decryptString(
        spotifyData.refresh_token as EncryptedString,
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
      () => new RefreshTokenFailure()
    ),
    TE.chain((response) =>
      response.status === 200 && response.data.access_token !== null
        ? TE.right({
            access_token: encryptString(
              response.data.access_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            refresh_token: encryptString(
              response.data.refresh_token as string,
              process.env.ENCRYPTION_SECRET as string
            ),
            state: spotifyData.state,
            scope: response.data.scope,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
          })
        : TE.left(new RefreshTokenFailure())
    )
  );
}

import * as TE from 'fp-ts/TaskEither';
import { SpotifyTokenData } from '../../../../utils/types';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import {
  AccessTokenFailure,
  SpotifyApiError,
  UserProfileError,
} from '../../../../utils/errors';
import { decryptString, encryptString } from '../../../../services';

export function getUserProfile(
  spotifyData: SpotifyTokenData
): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://api.spotify.com/v1/me',
    method: 'GET',
    headers: {
      Authorization:
        'Bearer ' +
        decryptString(
          spotifyData.accessToken,
          process.env.ENCRYPTION_SECRET as string
        ),
    },
  };

  return pipe(
    TE.tryCatch(
      () => axios(authOptions),
      (error) => new SpotifyApiError()
    ),
    TE.chain((response) =>
      response.status === 200 && response.data.access_token !== null
        ? TE.right({
            ...spotifyData,
            userUri: response.data.uri,
          } as SpotifyTokenData)
        : TE.left(new UserProfileError())
    )
  );
}

import * as TE from 'fp-ts/TaskEither';
import { SpotifyTokenData } from '../../../../utils/types';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import { AccessTokenFailure, UserProfileError } from '../../../../utils/errors';
import { encryptString } from '../../../../services';

export function getUserProfile(
  spotifyData: SpotifyTokenData
): TE.TaskEither<Error, SpotifyTokenData> {
  const authOptions = {
    url: 'https://api.spotify.com/v1/me',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + spotifyData.accessToken,
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
            ...spotifyData,
            userUri: response.data.uri,
          } as SpotifyTokenData)
        : TE.left(new UserProfileError())
    )
  );
}

import * as TE from 'fp-ts/TaskEither';
import DiscordUsers from '../../models/DiscordUsers';
import { pipe } from 'fp-ts/function';
import { DatabaseError, TokenNotFoundError } from '../../utils/errors';
import SpotifyCredentials from '../../models/SpotifyCredentials';

export function getToken(
  discordUser: DiscordUsers
): TE.TaskEither<DatabaseError, SpotifyCredentials> {
  return pipe(
    TE.tryCatch(
      () =>
        SpotifyCredentials.findOne({
          where: { userId: discordUser.id },
        }),
      (error) => new DatabaseError(error as Error)
    ),
    TE.chain((token) =>
      token ? TE.right(token) : TE.left(new TokenNotFoundError())
    )
  );
}

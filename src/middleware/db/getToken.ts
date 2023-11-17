import * as TE from 'fp-ts/TaskEither';
import DiscordUsers from '../../models/DiscordUsers';
import { pipe } from 'fp-ts/function';
import { Message } from 'discord.js';
import { DatabaseError, TokenNotFoundError } from '../../utils/errors';
import SpotifyTokens from '../../models/SpotifyTokens';

export function getToken(
  discordUser: DiscordUsers,
  message: Message
): TE.TaskEither<DatabaseError | TokenNotFoundError, SpotifyTokens> {
  return pipe(
    TE.tryCatch(
      () =>
        SpotifyTokens.findOne({
          where: { discordUserId: discordUser.id },
        }),
      (error: unknown) => new DatabaseError(message, error as Error)
    ),
    TE.chain((token) =>
      token ? TE.right(token) : TE.left(new TokenNotFoundError(message))
    )
  );
}

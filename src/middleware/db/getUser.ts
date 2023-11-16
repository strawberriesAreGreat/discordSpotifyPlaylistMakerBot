import * as TE from 'fp-ts/TaskEither';
import { hashDiscordId } from '../../services';
import DiscordUser from '../../models/DiscordUser';
import { pipe } from 'fp-ts/function';
import { Message } from 'discord.js';
import { DatabaseError, UserNotFoundError } from '../../utils/errors';

export function getUser(
  message: Message
): TE.TaskEither<
  DatabaseError | UserNotFoundError,
  [DiscordUser | undefined, Message]
> {
  return pipe(
    TE.tryCatch(
      () =>
        DiscordUser.findOne({
          where: { discordId: hashDiscordId(message.author.id) },
        }),
      (err: unknown) => new DatabaseError(message)
    ),
    TE.chain((user) =>
      user ? TE.right([user, message]) : TE.left(new UserNotFoundError(message))
    )
  );
}

import * as TE from 'fp-ts/TaskEither';
import { hashDiscordId } from '../../services';
import DiscordUsers from '../../models/DiscordUsers';
import { pipe } from 'fp-ts/function';
import { Message } from 'discord.js';
import { DatabaseError, UserNotFoundError } from '../../utils/errors';

export function getUser(
  message: Message
): TE.TaskEither<DatabaseError | UserNotFoundError, DiscordUsers> {
  return pipe(
    TE.tryCatch(
      () =>
        DiscordUsers.findOne({
          where: { discordId: hashDiscordId(message.author.id) },
        }),
      (err: unknown) => new DatabaseError(message)
    ),
    TE.chain((user) =>
      user ? TE.right(user) : TE.left(new UserNotFoundError(message))
    )
  );
}

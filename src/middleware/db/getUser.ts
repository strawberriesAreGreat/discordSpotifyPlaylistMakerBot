import * as TE from 'fp-ts/TaskEither';
import { hashDiscordId } from '../../services';
import DiscordUser from '../../models/DiscordUser';
import { pipe } from 'fp-ts/function';
import { Message } from 'discord.js';
import { DatabaseError, UserNotFoundError } from '../../utils/errors';

export function getUser(
  message: Message
): TE.TaskEither<Error, [DiscordUser, Message]> {
  return pipe(
    TE.tryCatch(
      () =>
        DiscordUser.findOne({
          where: { discord_id: hashDiscordId(message.author.id) },
        }),
      (err: unknown) => new DatabaseError(String(err))
    ),
    TE.chain((user) =>
      user ? TE.right([user, message]) : TE.left(new UserNotFoundError())
    )
  );
}

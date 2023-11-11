import { Message } from 'discord.js';
import {
  registeredUserCommandMap,
  unregisteredUserCommandMap,
} from './commandDictionary';
import { pipe } from 'fp-ts/lib/function';
import { getUser } from '../db/getUser';
import * as TE from 'fp-ts/TaskEither';
import { CommandNotFoundError } from '../../utils/errors';
import DiscordUser from '../../models/DiscordUser';

// get user auth token, run command if auth token exists
export function discordCommandsUsingAuth(message: Message): void {
  pipe(
    message,
    TE.right,
    TE.chain(getUser),
    TE.chain(runCommand),
    TE.fold(
      (err) => {
        console.warn(err);
        return TE.of(undefined);
      },
      () => TE.of(undefined)
    )
  )();
}

export function discordCommandsNotUsingAuth(message: Message): void {
  pipe(
    message,
    TE.right,
    TE.chain(getUser),
    TE.chain(runCommand),
    TE.fold(
      (err) => {
        console.warn(err);
        return TE.of(undefined);
      },
      () => TE.of(undefined)
    )
  )();
}

function runCommand([user, message]: [DiscordUser, Message]): TE.TaskEither<
  Error,
  void
> {
  const commandName = message.content.split(' ')[0];

  for (let [regex, commandFunction] of registeredUserCommandMap) {
    if (regex.test(commandName)) {
      return TE.right(commandFunction(user, message));
    }
  }

  return TE.left(new CommandNotFoundError());
}

import { Message } from 'discord.js';
import {
  registeredUserCommandMap,
  unregisteredUserCommandMap,
} from './commandDictionary';
import { pipe } from 'fp-ts/lib/function';
import { getUser } from '../db/getUser';
import * as TE from 'fp-ts/TaskEither';
import DiscordUser from '../../models/DiscordUser';
import * as A from 'fp-ts/lib/Array';
import { CommandNotFoundError } from '../../utils/errors';
import * as O from 'fp-ts/Option';

// get user auth token, run command if auth token exists
export function discordCommand(message: Message): void {
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

export function runCommand([user, message]: [
  DiscordUser | null,
  Message,
]): TE.TaskEither<Error, void> {
  const commandName = message.content.split(' ')[0];
  let commandMap: Map<any, any>;
  let args: any[] = [];

  user
    ? (commandMap = registeredUserCommandMap) && (args = [user, message])
    : (commandMap = unregisteredUserCommandMap) && (args = [message]);

  return pipe(
    Array.from(commandMap),
    A.findFirst(([regex, _]) => regex.test(commandName)),
    O.fold(
      () => TE.left(new CommandNotFoundError(message)),
      (command) => TE.right(command[1](...args))
    )
  );
}

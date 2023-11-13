import { Message } from 'discord.js';
import {
  CommandFunction,
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
import { taskEither } from 'fp-ts';


type context = {
  user: DiscordUser | null;
  message: Message;
  command: CommandFunction;
  args: string[];
};


// get user auth token, run command if auth token exists
export function discordCommand( message: Message ): void {
  pipe(
    {message} as context,
    TE.right,
    TE.chain(getCommand),
    TE.chain(compileArgs),
    TE.chain(runCommand)
    TE.fold(
      (err) => {
        console.warn(err);
        return TE.of(undefined);
      },
      () => TE.of(undefined)
    )
  )();
}

function getCommand({message}: context): TE.TaskEither<Error, context> {
  const commandName = message.content.split(' ')[0];

  return pipe(
    [...unregisteredUserCommandMap, ...registeredUserCommandMap],
    A.findFirst(([regex, _]) => regex.test(commandName)),
    O.fold(
      () => TE.left(new CommandNotFoundError(message)),
      ([_,command]) => TE.right( {message: message, command: command} as context))
    ) 
}

export function runCommand({message, command}:context [
  DiscordUser | null,
  Message,
]): TE.TaskEither<Error, void> {
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

function compileArgs({ message, command }: context): TE.TaskEither<Error, context> {
  return pipe(
    { message, command } as context,
    TE.right,
    TE.chain((context) => {
      if (command.requiresUser) {
        return pipe(
          getUser(context.message),
          TE.chain((user) => {
            if (!user) {
              context.message.channel.send('Sorry, you need to authorize your account before SpotifyPlaylistBot can run spotify commands. \nTry running the /authorize command.');
              return TE.left(new Error('Unauthorized'));
            }
            return TE.right({...context, user: user[0]});
          })
        );
      }
      return TE.right(context);
    })
  );
}

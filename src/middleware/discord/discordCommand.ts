import { Message } from 'discord.js';
import {
  registeredUserCommandMap,
  unregisteredUserCommandMap,
} from './commandDictionary';
import { pipe } from 'fp-ts/lib/function';
import { getUser } from '../db/models/DiscordUsers/getUser';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/lib/Array';
import {
  CommandNotFoundError,
  UnauthorizedDiscordCommand,
} from '../../utils/errors';
import * as O from 'fp-ts/Option';
import { DiscordUserData } from '../../utils/types/interfaces';
import { getSpotifyCredentials } from '../spotify/getSpotifyCredentials';

// get user auth token, run command if auth token exists
export function discordCommand(message: Message): void {
  pipe(
    { message } as DiscordUserData,
    TE.right,
    TE.chain(getCommand),
    TE.chain(compileArgs),
    TE.chain(combineDiscordUserDataAndSpotifyToken),
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

export function getCommand({
  message,
}: DiscordUserData): TE.TaskEither<Error, DiscordUserData> {
  const commandName = message.content.split(' ')[0];

  return pipe(
    [...unregisteredUserCommandMap, ...registeredUserCommandMap],
    A.findFirst(([regex, _]) => regex.test(commandName)),
    O.fold(
      () => TE.left(new CommandNotFoundError(message)),
      ([_, command]) =>
        TE.right({ message: message, command: command } as DiscordUserData)
    )
  );
}

// TODO: review how userNotFound is being swallowed and replaced with UnauthorizedDiscordCommand
export function compileArgs({
  message,
  command,
}: DiscordUserData): TE.TaskEither<Error, DiscordUserData> {
  return pipe(
    { message, command } as DiscordUserData,
    TE.right,
    TE.chain((DiscordUserData) => {
      if (command.requiresUser) {
        return pipe(
          getUser(DiscordUserData.message),
          TE.fold(
            (error) =>
              TE.left(new UnauthorizedDiscordCommand(DiscordUserData.message)),
            (user) =>
              TE.right({ ...DiscordUserData, user: user } as DiscordUserData)
          )
        );
      }
      return TE.right(DiscordUserData);
    })
  );
}

export function combineDiscordUserDataAndSpotifyToken(
  discordUserData: DiscordUserData
): TE.TaskEither<Error, DiscordUserData> {
  if (discordUserData.command.requiresUser) {
    return pipe(
      discordUserData,
      TE.right,
      TE.chain(getSpotifyCredentials),
      TE.map((credentials) => ({
        ...discordUserData,
        spotifyCredentials: credentials,
      }))
    );
  } else {
    return TE.right(discordUserData);
  }
}

export function runCommand({
  message,
  command,
  user,
  spotifyCredentials,
}: DiscordUserData): TE.TaskEither<Error, void> {
  if (!command.execute) {
    return TE.left(new Error('Command not found'));
  }
  if (command.requiresUser && !spotifyCredentials) {
    return TE.left(new UnauthorizedDiscordCommand(message));
  }

  return pipe(
    { message, command, spotifyCredentials },
    TE.right,
    TE.chain(() => {
      try {
        return command.requiresUser
          ? TE.right(command.execute(spotifyCredentials, message) as void)
          : TE.right(command.execute(message) as void);
      } catch (err) {
        return err instanceof Error
          ? TE.left(err)
          : TE.left(new Error('Command failed'));
      }
    }),
    TE.fold(
      (err) => {
        console.warn(err);
        if (err) {
          // react with stop sign emoji on message and dm user
          console.log('RESPONSE', err);
        }
        return TE.of(undefined);
      },
      () => TE.of(undefined)
    )
  );
}

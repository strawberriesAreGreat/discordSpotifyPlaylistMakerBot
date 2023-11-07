import { Message } from 'discord.js';
import { commandMap } from './commandDictionary';
import { pipe } from 'fp-ts/lib/function';

export function discordCommand(message: Message): void {
  // get user auth token, run command if auth token exists
  pipe(message.content.split(' ')[0], (commandName) => {
    for (let [regex, commandFunction] of commandMap) {
      if (regex.test(commandName)) {
        commandFunction(message);
        break;
      }
    }
  });

  const commandName = message.content.split(' ')[0];

  for (let [regex, commandFunction] of commandMap) {
    if (regex.test(commandName)) {
      commandFunction(message);
      break;
    }
  }
}

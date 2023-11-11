import { Message } from 'discord.js';
import * as commands from './commands';
import DiscordUser from '../../models/DiscordUser';

export const registeredUserCommandMap = new Map<
  RegExp,
  (discordUser: DiscordUser, message: Message) => void
>([
  [
    /^!createplaylist$/i,
    (user, message) => commands.createPlaylist(user, message),
  ],
  [/^!getplaylist$/i, (user, message) => commands.getPlaylist(user, message)],
  [
    /^!createplaylist$/i,
    (user, message) => commands.createPlaylist(user, message),
  ],
  [
    /^!updateplaylist$/i,
    (user, message) => commands.updatePlaylist(user, message),
  ],
  [/^!removesong$/i, (user, message) => commands.removeSong(user, message)],
  [/^!addsong$/i, (user, message) => commands.addSong(user, message)],
  [/^!help$/i, (user, message) => commands.help(message)],
]);

export const unregisteredUserCommandMap = new Map<
  RegExp,
  (message: Message) => void
>([
  [/^!authorize$/i, (message) => commands.sendAuthorizationLink(message)],
  [/^!help$/i, (message) => commands.help(message)],
]);

import { Message } from 'discord.js';
import * as commands from './commands';

export const commandMap = new Map<RegExp, (message: Message) => void>([
  [/^!authorize$/i, (message) => commands.sendAuthorizationLink(message)],
  [/^!createplaylist$/i, (message) => commands.createPlaylist(message)],
  [/^!help$/i, (message) => commands.help(message)],
  [/^!getplaylist$/i, (message) => commands.getPlaylist(message)],
  [/^!createplaylist$/i, (message) => commands.createPlaylist(message)],
  [/^!updateplaylist$/i, (message) => commands.updatePlaylist(message)],
  [/^!removesong$/i, (message) => commands.removeSong(message)],
  [/^!addsong$/i, (message) => commands.addSong(message)],
]);

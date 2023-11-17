import * as commands from './commands';

export type DiscordCommand = {
  execute: (...args: any[]) => void;
  requiresUser: boolean;
};
export const registeredUserCommandMap = new Map<RegExp, DiscordCommand>([
  [
    /^!createplaylist$/i,
    {
      execute: (user, message) => commands.createPlaylist(user, message),
      requiresUser: true,
    },
  ],
  [
    /^!getplaylist$/i,
    {
      execute: (user, message) => commands.getPlaylist(user, message),
      requiresUser: true,
    },
  ],
  [
    /^!createplaylist$/i,
    {
      execute: (user, message) => commands.createPlaylist(user, message),
      requiresUser: true,
    },
  ],
  [
    /^!updateplaylist$/i,
    {
      execute: (user, message) => commands.updatePlaylist(user, message),
      requiresUser: true,
    },
  ],
  [
    /^!removesong$/i,
    {
      execute: (user, message) => commands.removeSong(user, message),
      requiresUser: true,
    },
  ],
  [
    /^!addsong$/i,
    {
      execute: (user, message) => commands.addSong(user, message),
      requiresUser: true,
    },
  ],
]);

export const unregisteredUserCommandMap = new Map<RegExp, DiscordCommand>([
  [
    /^!authorize$/i,
    {
      execute: (message) => commands.sendAuthorizationLink(message),
      requiresUser: false,
    },
  ],
  [
    /^!help$/i,
    {
      execute: (message) => commands.help(message),
      requiresUser: false,
    },
  ],
]);

// utils/types/DiscordUserData.ts

import { Message } from 'discord.js';
import { DiscordUser, SpotifyToken } from '../../../models';
import { DiscordUsername, DiscordId } from '../enums';
import { DiscordCommand } from '../../../middleware/discord/commandDictionary';

export interface DiscordUserData {
  user: DiscordUser;
  token: SpotifyToken;
  message: Message;
  command: DiscordCommand;
  args: string[];
}

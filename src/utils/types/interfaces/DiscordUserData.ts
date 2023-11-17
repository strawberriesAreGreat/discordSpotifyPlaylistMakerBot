// utils/types/DiscordUserData.ts

import { Message } from 'discord.js';
import { DiscordUsers, SpotifyTokens } from '../../../models';
import { DiscordUsername, DiscordId, AccessToken } from '../enums';
import { DiscordCommand } from '../../../middleware/discord/commandDictionary';

export interface DiscordUserData {
  user: DiscordUsers;
  token: AccessToken;
  message: Message;
  command: DiscordCommand;
  args: string[];
}

// utils/types/DiscordUserData.ts

import { Message } from 'discord.js';
import {
  DiscordUsers,
  SpotifyCredentials,
} from '../../../middleware/db/models';
import { DiscordUsername, DiscordId, AccessToken } from '../enums';
import { DiscordCommand } from '../../../middleware/discord/commandDictionary';

export interface DiscordUserData {
  user: DiscordUsers;
  spotifyCredentials: SpotifyCredentials;
  message: Message;
  command: DiscordCommand;
  args: string[];
}

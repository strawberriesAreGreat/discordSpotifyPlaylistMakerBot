import { Message } from 'discord.js';
import { AccessToken, DiscordId, RefreshToken } from '../../utils/types';

export function authorizeDiscordUser(DiscordId: DiscordId): AccessToken {
  // gets token from database using DiscordId
  // if token is expired, refreshes token
  // returns token
  return 'encrypted token' as AccessToken;
}

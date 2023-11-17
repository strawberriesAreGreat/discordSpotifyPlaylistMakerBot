// factories.ts
import factory from 'factory-girl';
import { faker } from '@faker-js/faker';
import { DiscordUsers } from './DiscordUsers';
import { SpotifyTokens } from './SpotifyTokens';

factory.define('DiscordUser', DiscordUsers, {
  discordId: factory.sequence(
    'DiscordUser.discordId',
    (n: any) => `discordId${n}`
  ),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

factory.define('SpotifyToken', SpotifyTokens, {
  id: factory.sequence('SpotifyToken.id', (n: any) => n),
  access_token: factory.sequence(
    'SpotifyToken.access_token',
    (n: any) => `access_token${n}`
  ),
  scope: factory.sequence('SpotifyToken.scope', (n: any) => `scope${n}`),
  refresh_token: factory.sequence(
    'SpotifyToken.refresh_token',
    (n: any) => `refresh_token${n}`
  ),
  token_expiry: factory.sequence('SpotifyToken.token_expiry', (n: any) => n),
  token_expiry_timestamp: factory.sequence(
    'SpotifyToken.token_expiry_timestamp',
    (n: any) => faker.date.future(n)
  ),
  discord_user_id: factory.sequence(
    'SpotifyToken.discord_user_id',
    (n: any) => `discord_user_id${n}`
  ),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

export default factory;

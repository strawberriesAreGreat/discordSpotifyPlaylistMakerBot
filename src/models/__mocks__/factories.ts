// factories.ts
import factory from 'factory-girl';
import { faker } from '@faker-js/faker';
import { DiscordUser } from './DiscordUser';
import { SpotifyToken } from './SpotifyToken';

factory.define('DiscordUser', DiscordUser, {
  discordId: factory.sequence('DiscordUser.discordId', (n) => `discordId${n}`),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

factory.define('SpotifyToken', SpotifyToken, {
  id: factory.sequence('SpotifyToken.id', (n) => n),
  access_token: factory.sequence(
    'SpotifyToken.access_token',
    (n) => `access_token${n}`
  ),
  scope: factory.sequence('SpotifyToken.scope', (n) => `scope${n}`),
  refresh_token: factory.sequence(
    'SpotifyToken.refresh_token',
    (n) => `refresh_token${n}`
  ),
  token_expiry: factory.sequence('SpotifyToken.token_expiry', (n) => n),
  token_expiry_timestamp: factory.sequence(
    'SpotifyToken.token_expiry_timestamp',
    (n) => faker.date.future(n)
  ),
  discord_user_id: factory.sequence(
    'SpotifyToken.discord_user_id',
    (n) => `discord_user_id${n}`
  ),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

export default factory;

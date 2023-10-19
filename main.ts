import DiscordClient from './src/discordClient';
import { eventListeners } from './src/middleware/eventListeners';
import SpotifyAuth from './src/spotifyAuth';
import server from './src/spotifyAuthCallback';

SpotifyAuth.getAccessToken();
server;
const client = new DiscordClient();
eventListeners(client);

client.login();

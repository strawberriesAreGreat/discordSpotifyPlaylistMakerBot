import DiscordClient from './src/discordClient';
import { eventListeners } from './src/middleware/eventListeners';
import SpotifyAuth from './src/spotifyAuth';
import server, { requestAccessToken } from './src/spotifyAuthCallback';

//SpotifyAuth.getAccessToken();
server.listen(process.env.PORT, () => {});
const client = new DiscordClient();
eventListeners(client);
client.login();

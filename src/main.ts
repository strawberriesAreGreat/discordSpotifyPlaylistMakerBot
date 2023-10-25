import DiscordClient from './middleware/discord/discordClient';
import { eventListeners } from './middleware/discord/helpers/listener';
import SpotifyAuth from './api/spotify/spotifyAuth';
import server, { requestAccessToken } from './api/spotify/spotifyAuthCallback';

//SpotifyAuth.getAccessToken();
server.listen(process.env.REDIRECT_PORT, () => {
  console.log(`Server running on port ${process.env.REDIRECT_PORT}`);
});
const client = new DiscordClient();
eventListeners(client);
client.login();

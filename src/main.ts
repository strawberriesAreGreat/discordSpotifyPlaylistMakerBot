import DiscordClient from './middleware/discord/discordClient';
import { eventListeners } from './middleware/discord/helpers/listener';
import SpotifyAuth from './middleware/spotify/spotifyAuth';
import server, {
  requestAccessToken,
} from './middleware/spotify/spotifyAuthCallback';

//SpotifyAuth.getAccessToken();
server.listen(process.env.REDIRECT_PORT, () => {
  console.log(`Server running on port ${process.env.REDIRECT_PORT}`);
});
const client = new DiscordClient();
eventListeners(client);
client.login();

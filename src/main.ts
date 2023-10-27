import DiscordClient from './middleware/discord/discordClient';
import { eventListeners } from './middleware/discord/helpers/listener';
import server, {
  requestAccessToken,
} from './middleware/spotify/spotifyAuthCallback';
import { DiscordUser } from './models/DiscordUser';
import { SpotifyToken } from './models/SpotifyToken';
import { sequelize } from './models/db';
import { DiscordId } from './utils/types';

//SpotifyAuth.getAccessToken();
server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});

try {
  console.log('Syncing Sequelize models');
  await sequelize.sync();
} catch (error) {
  console.log(`Error syncing Sequelize models: ${error}`);
}

const client = new DiscordClient();
eventListeners(client);
client.login();

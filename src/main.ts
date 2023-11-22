import DiscordClient from './middleware/discord/discordClient';
import { eventListeners } from './middleware/discord/listener';
import server from './middleware/spotify/registerNewUser';

console.log('Starting server...');
server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});

const client = new DiscordClient();
eventListeners(client);
client.login();

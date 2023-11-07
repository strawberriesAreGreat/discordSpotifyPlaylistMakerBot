import { Message, TextChannel, Guild } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { getURIS, addSongs } from './services';
import DiscordClient from '../discordClient';
import { updatePlaylist, getPlaylist, createPlaylist } from './commands';
import { sendAuthorizationLink } from './commands/sendAuthorizationLink';
import { commandMap } from './commandDictionary';

export function eventListeners(client: DiscordClient) {
  client.on('ready', () => {
    console.log('Client: ready.');
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('guildCreate', (guild: Guild) => {
    console.log('Client: guild create.');

    console.log(guild.id);
    console.log(guild.channels);

    const channelNames: string[] = ['music'];
    const channel: TextChannel | undefined = guild.channels.cache.find((ch) =>
      channelNames.includes(ch.name)
    ) as TextChannel | undefined;

    if (channel) {
      channel
        .send(
          `Hello i'm ${client.user?.username}!!! Type \`!help\` to view my commands 🐧"`
        )
        .catch(console.error);

      axios
        .post(`${process.env.API_URL}playlists/`, {
          group_id: guild.id,
          group_name: guild.name,
        })
        .then((res: AxiosResponse) => {
          if (channel) {
            channel.send(
              `Oh btw, I just created a playlist for ${guild.name} 🐧`
            );
          }
          console.log(res.status);
        })
        .catch((error: Error) => {
          console.log(
            `ERROR: COULDNT MAKE NEW PLAYLIST FOR THIS SERVER ${error}`
          );
        });
    }
  });

  client.on('messageCreate', async (message: Message) => {
    const commandName = message.content.split(' ')[0];

    for (let [regex, commandFunction] of commandMap) {
      if (regex.test(commandName)) {
        commandFunction(message);
        break;
      }
    }

    if (message.author.bot) return;

    if (message.content.includes('https://open.spotify.com/track/')) {
      const spotifyUris = getURIS(message.content);

      addSongs(message, spotifyUris);
    }
  });
}

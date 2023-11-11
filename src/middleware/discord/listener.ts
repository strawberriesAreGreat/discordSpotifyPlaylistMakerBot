import { Message, TextChannel, Guild } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import DiscordClient from './discordClient';
import {
  discordCommandsUsingAuth,
  discordCommandsNotUsingAuth,
} from './discordCommand';

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
    if (message.content.startsWith('!')) {
      //TODO: check one then the other
      discordCommandsNotUsingAuth(message);
      discordCommandsUsingAuth(message);
    }
  });
}

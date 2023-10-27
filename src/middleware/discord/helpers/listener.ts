import { Message, TextChannel, Guild } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { getURIS, addSongs } from './services';
import DiscordClient from '../discordClient';
import { updatePlaylist, getPlaylist, createPlaylist } from './commands';
import { encrypt } from '../../../services';

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
    console.log('Client: message create.');

    console.log(message.content);
    if (message.author.bot) return;

    const SPOTIFY_AUTH_BASE_URL = 'https://accounts.spotify.com/authorize';
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = `${process.env.SCHEME}://${process.env.HOSTNAME}:${process.env.REDIRECT_PORT}${process.env.REDIRECT_PATH}`;
    const SCOPES = 'playlist-modify-private';

    // This is the function to send the authorization link to the user
    function sendAuthorizationLink(message: Message, authorID: string) {
      let state = encrypt(authorID);
      const authLink = `${SPOTIFY_AUTH_BASE_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${state}`;
      message.author.send(
        `Please authorize the app by clicking on the following link: ${authLink}`
      );
    }

    // Assuming you have a Discord client set up
    if (message.content === '!requestAuthorization') {
      sendAuthorizationLink(message, message.author.id as string);
    }

    if (message.content.startsWith('!createPlaylist')) {
      console.log('new playlist requested');
      createPlaylist(message);
    }

    if (message.content === '!playlistbot') {
      message.reply('hi there');
    }

    if (
      message.content.startsWith('!rmvsong') ||
      message.content.startsWith('!rmvSong')
    ) {
      const spotifyUris = getURIS(message.content);
    }

    if (message.content.includes('https://open.spotify.com/track/')) {
      const spotifyUris = getURIS(message.content);

      addSongs(message, spotifyUris);
    }

    if (message.content.includes('!updatePlaylist' || '!updateplaylist')) {
      getPlaylist(message);
      updatePlaylist(message);
    }

    if (message.content.includes('!help' || '!Help')) {
      message.channel.send(
        '**Command List**:\n**!help** thats this!\n**!updatePlaylist** Searches this channel for songs to add\n**!rmvSong** *[song url]* Remove a specific song from the playlist using a song link\n**!playlist** The link to your server playlist'
      );
    }
    if (message.content === '!Authorize') {
      // This is the function to send the authorization link to the user
      sendAuthorizationLink(message, message.author.id as string);
    }
  });
}

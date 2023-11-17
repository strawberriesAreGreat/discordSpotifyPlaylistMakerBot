import axios, { AxiosResponse } from 'axios';
import Discord, { Message } from 'discord.js';
import dotenv from 'dotenv';
import { DiscordUsers } from '../../../models';

dotenv.config();

export async function getPlaylist(user: DiscordUsers, message: Message) {
  if (message.content.includes('!playlist' || '!Playlist')) {
    axios
      .get(`${process.env.API_URL}playlists/${message.guildId}`)
      .then((res: AxiosResponse) => {
        const uri = res.data._id;
        message.channel.send('https://open.spotify.com/playlist/' + uri);
      })
      .catch((error: Error) => {
        message.channel.send(
          'No Playlist found. Run **!updatePlaylist** to start one. '
        );
      });
  }
}

import axios, { AxiosResponse } from 'axios';
import Discord, { Message } from 'discord.js';
import dotenv from 'dotenv';
import { DiscordUsers, SpotifyCredentials } from '../../../models';
import { TextChannel } from 'discord.js';
import { decryptString } from '../../../services';

// curl --request POST \
//   --url https://api.spotify.com/v1/users/smedjan/playlists \
//   --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z' \
//   --header 'Content-Type: application/json' \
//   --data '{
//     "name": "New Playlist",
//     "description": "New playlist description",
//     "public": false
// }'

export async function createPlaylist(
  spotifyCredentials: SpotifyCredentials,
  message: Message
) {
  console.log('Creating playlist');

  const playlistName =
    message.guild?.name +
    ' - ' +
    (message.channel as TextChannel).name?.replace(/-/g, ' ');
  const playlistDescription =
    message.guild?.description ||
    `Playlist created from songs posted on ${message.guild?.name} in channel ${(
      message.channel as TextChannel
    ).name?.replace(/-/g, ' ')}`;

  const authOptions = {
    url: `https://api.spotify.com/v1/users/${spotifyCredentials.userUri}/playlists`,
    method: 'POST',
    headers: {
      Authorization:
        'Bearer ' +
        decryptString(
          spotifyCredentials.accessToken,
          process.env.ENCRYPTION_SECRET as string
        ),
      'Content-Type': 'application/json',
    },
    data: {
      name: playlistName,
      description: playlistDescription,
      public: false,
    },
  };

  try {
    const response = await axios(authOptions);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

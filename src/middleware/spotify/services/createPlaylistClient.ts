import axios, { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { SpotifyCredentials } from '../../../middleware/db/models';
import { TextChannel } from 'discord.js';
import { decryptString } from '../../../services';

export async function createPlaylistClient(
  spotifyCredentials: SpotifyCredentials,
  message: Message
): Promise<AxiosResponse<any> | Error> {
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

  return axios(authOptions);
}

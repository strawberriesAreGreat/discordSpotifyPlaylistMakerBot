import axios, { AxiosResponse } from 'axios';
import Discord, { Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export async function createPlaylist(message: Message) {
  console.log('Creating playlist');
  const args = message.content.split(' ');

  if (args.length >= 2) {
    const playlistName = args.slice(1).join(' ');

    //TODO: Get user ID from Spotify AaPI
    const userId = '31li5bcqfcbaaq5lgjvrimdhonve';

    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          description: 'New playlist description',
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const playlistId = response.data.id;
      message.channel.send(
        `New playlist "${playlistName}" has been created with ID ${playlistId}`
      );
    } catch (error) {
      console.error('Error creating playlist:', error);
      message.channel.send('Error creating playlist. Please try again later.');
    }
  } else {
    message.channel.send('Please provide a name for the new playlist.');
  }
}

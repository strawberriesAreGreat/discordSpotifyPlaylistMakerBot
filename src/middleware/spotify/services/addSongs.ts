import axios, { AxiosResponse } from 'axios';
import Discord, { Message } from 'discord.js';
import dotenv from 'dotenv';
import {
  DiscordUsers,
  SpotifyCredentials,
} from '../../../middleware/db/models';
import { TextChannel } from 'discord.js';
import { decryptString } from '../../../services';
import { SpotifyApiError } from '../../../utils/errors';

// curl --request POST \
//   --url https://api.spotify.com/v1/users/smedjan/playlists \
//   --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z' \
//   --header 'Content-Type: application/json' \
//   --data '{
//     "name": "New Playlist",
//     "description": "New playlist description",
//     "public": false
// }'

export async function addSongs(
  spotifyCredentials: SpotifyCredentials,
  message: Message
) {
  // console.log('Adding songs to playlist');
  // // check database for server and channel playlist
  // // if it exists - check channel for any new songs, then add saved songs from database and new songs to the spotify playlist
  // // scrape channel for all songs
  // try {
  //   const response = await axios(authOptions);
  //   console.log(response);
  //   message.react('🐧');
  //   return response;
  // } catch (error) {
  //   new SpotifyApiError(error as Error);
  //   message.react('😢');
  //   return error;
  // }
}

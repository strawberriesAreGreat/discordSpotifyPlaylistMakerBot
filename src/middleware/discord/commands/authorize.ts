import { Message } from 'discord.js';
import { encryptString } from '../../../services';

const SPOTIFY_AUTH_BASE_URL = 'https://accounts.spotify.com/authorize';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = `${process.env.APP_SCHEME}://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}${process.env.SPOTIFY_OAUTH_REDIRECT_PATH}`;
const SCOPES = 'playlist-modify-private';

// This is the function to send the authorization link to the user
export function authorize(message: Message) {
  let ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET as string;
  let state = encryptString(message.author.id, ENCRYPTION_KEY);
  const authLink = `${SPOTIFY_AUTH_BASE_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${state}`;
  message.author.send(
    `Please authorize the app by clicking on the following link: ${authLink}`
  );
}

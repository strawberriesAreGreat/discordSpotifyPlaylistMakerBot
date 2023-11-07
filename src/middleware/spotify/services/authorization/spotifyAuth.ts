// spotifyAuth.ts
import axios from 'axios';
import qs from 'querystring';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export function getAccessToken(this: any): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Spotify client ID or client secret in environment variables'
    );
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const headers = {
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const data = {
    grant_type: 'client_credentials',
  };

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify(data),
      headers
    );
    this.accessToken = response.data.access_token;
    this.tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error retrieving access token:', error);
    throw error;
  }

  return this.accessToken;
}

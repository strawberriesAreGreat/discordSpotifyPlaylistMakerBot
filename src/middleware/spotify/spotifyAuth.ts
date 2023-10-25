// spotifyAuth.ts
import axios from 'axios';
import qs from 'querystring';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

class SpotifyAuth {
  private accessToken: string = '';
  private tokenExpiration: number = 0;

  async getAccessToken(): Promise<string> {
    if (this.tokenExpiration < Date.now()) {
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Missing Spotify client ID or client secret in environment variables');
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
        const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers);
        this.accessToken = response.data.access_token;
        this.tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convert to milliseconds
        this.writeToEnv('SPOTIFY_ACCESS_TOKEN', this.accessToken); // Write to .env file
      } catch (error) {
        console.error('Error retrieving access token:', error);
        throw error;
      }
    }

    return this.accessToken;
  }

  private writeToEnv(key: string, value: string): void {
    try {
      const envConfig = dotenv.parse(fs.readFileSync('.env'));
      envConfig[key] = value;
      const envConfigString = Object.keys(envConfig)
        .map((key) => `${key}=${envConfig[key]}`)
        .join('\n');
      fs.writeFileSync('.env', envConfigString);
      console.log(`${key} has been added to .env file`);
    } catch (error) {
      console.error('Error writing to .env file:', error);
      throw error;
    }
  }
}

export default new SpotifyAuth();

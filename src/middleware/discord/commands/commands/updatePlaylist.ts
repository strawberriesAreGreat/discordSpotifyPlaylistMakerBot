import axios, { AxiosResponse } from 'axios';
import Discord, { Message, TextBasedChannel } from 'discord.js';
import dotenv from 'dotenv';
import { getURIS, addSongs } from '../../../spotify/commands';

dotenv.config();

export async function updatePlaylist(message: Message) {
  let limit = 100;
  let result: string[][] = [];
  let uris: string[] = [];
  let z = 0;
  let last_id: string | undefined;

  while (true) {
    const options: { limit: number; before?: string } = {
      limit: 100,
    };

    if (last_id) {
      options.before = last_id;
    }

    const messages = await (message.channel as TextBasedChannel).messages.fetch(
      options
    );

    let tmpMsg = '';
    let i = 0;

    while (i < 100) {
      try {
        const currentMessage = messages.at(i);
        if (currentMessage && currentMessage.content) {
          tmpMsg = currentMessage.content;
        }
      } catch (e) {
        console.log(e);
      }

      if (tmpMsg.includes('https://open.spotify.com/track/')) {
        let tmpUriArray = getURIS(tmpMsg);

        for (let x in tmpUriArray) {
          if (uris.length <= 99) uris.push(tmpUriArray[x]);
          else {
            result[z] = uris;
            uris = [];
            z++;
          }
        }
      }
      i++;
    }

    if (messages.last()) {
      last_id = messages.last()?.id;
    }

    if (messages.size !== 100) {
      break;
    }
  }

  for (let j in result) {
    console.log(j);
    addSongs(message, result[j]);
  }

  console.log(result);

  axios
    .get(`${process.env.API_URL}playlists/${message.guildId}`)
    .then((res: AxiosResponse) => {
      let uri = res.data._id;
      message.reply(`https://open.spotify.com/playlist/${uri}`);
    })
    .catch((error) => {
      console.log(error);
      message.reply(
        'No Playlist found. Run **!createPlaylist** to start one. '
      );
    });
}

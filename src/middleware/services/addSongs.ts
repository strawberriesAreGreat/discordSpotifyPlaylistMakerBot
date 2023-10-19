import axios, { AxiosResponse } from 'axios';
import Discord, {
    Message,
} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export async function addSongs(message: Message, songs: string[]): Promise<void> {
    const guildId = message.guild?.id;
    const guildName = message.guild?.name;

    if (guildId) {
        await axios
            .post(`${process.env.API_URL}playlists/${guildId}/songs`, {
                spotify_tracks: songs,
            })
            .then((res: AxiosResponse) => {
                console.log(res.status);
                message.react('🐧');
            })
            .catch((error: Error) => {
                if (error.toString().includes('404')) {
                    console.log("INFO: No playlist exists. Creating playlist.");
                    axios
                        .post(`${process.env.API_URL}playlists/`, {
                            group_id: guildId,
                            group_name: guildName,
                        })
                        .then((res: AxiosResponse) => {
                            console.log(res);
                            addSongs(message, songs);
                        })
                        .catch((error: Error) => {
                            console.log("ERROR: COULDNT Add music" + error);
                        });
                }
            });
    } else {
        console.error("Error: Guild ID not found");
    }
}

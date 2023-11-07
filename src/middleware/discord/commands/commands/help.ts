// TODO: iterate through command-dictionary and generate a list of commands

import { Message } from 'discord.js';

export function help(message: Message): void {
  message.channel.send(
    '**Command List**:\n**!help** thats this!\n**!updatePlaylist** Searches this channel for songs to add\n**!rmvSong** *[song url]* Remove a specific song from the playlist using a song link\n**!playlist** The link to your server playlist'
  );
}

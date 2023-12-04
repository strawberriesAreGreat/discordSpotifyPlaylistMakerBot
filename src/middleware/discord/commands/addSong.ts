//TODO: Add single song to playlist
import { Message } from 'discord.js';
import { DiscordUsers } from '../../db/models';
export function addSong(user: DiscordUsers, message: Message): void {}

// 1. Adding song to Song database

// check SpotifySongs table for song[s]

// if song[s] exist, increment count

// if song[s] don't exist, scrape song data from Spotify API and add to table

// add song[s] to playlist with details

// 2. Adding song to playlist

// check if playlist exists

// if playlist exists, add song to playlist

// if playlist doesn't exist, create playlist and add song to playlist

// 3. Adding song to user's playlist list

// check for all user's in channel that are authorized

// update their playlist list with new songs

require('dotenv').config();
const axios = require('axios');

const http = require("http");
const url = require("url");
var pathToRegex = require('path-to-regex');


const Discord = require('discord.js');
const {GatewayIntentBits, Partials} = require('discord.js');
const {match} = require('assert');

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
})


function getURIS(str) {

    var matches = str.match(/\bhttps?:\/\/\S+/gi);
    var result = [];

    matches.forEach(element => {

        try {
            var path = url.parse(element).pathname
            let parser = new pathToRegex('/track/:uri')
            let URI = parser.match(path).uri;
            result.push(URI);
        } catch (e) {
            console.log("ERROR AT: " + element + "\n" + e);
        }

    });

    return result;


}

function addSongs(message, songs) {


        axios.post(
            (process.env.API_URL + "playlists/" + message.guild.id + "/songs"), 
            {"spotify_tracks": songs}
        ).then(res => {

            console.log(res.status);
            addingSong = false;

        }).catch(error => {


            if ( error.toString().includes('404') ) {

                console.log("INFO: No playlist exists. Creating playlist.")
               
                return axios.post((process.env.API_URL + "playlists/"), {

                    "group_id": message.guild.id,
                    "group_name": message.guild.name
            
                })
                .then(res => {
                    console.log(res);
                    addSongs(message, songs)

                }).catch(error => {
                    console.log("ERROR: COULDNT Add music" + error)
                });

            }else{
                addingSong = false;
            }
        });

    


}

client.on("ready", () => {
    console.log("Bot is ready")
    console.log(`Logged in as ${
        client.user.tag
    }!`);

})

client.on('guildCreate', (guild) => {

    console.log(guild.id);
    console.log(guild.channels);

    const channelNames = ['music']
    const channel = guild.channels.cache.find(ch => channelNames.includes(ch.name))


    if (channel) 
        channel.send(`Hello i'm ${
            client.user.username
        }!!! Type \`!help\` to view my commands 🐧"`).catch(console.error);
    


    axios.post((process.env.API_URL + "playlists/"), {

        "group_id": guild.id,
        "group_name": guild.name

    }).then(res => {
        if (channel) 
            channel.send("Oh btw, I just created a playlist for " + guild.name + " 🐧")

        console.log(res.status);

    }).catch(error => {
        console.log("ERROR: COULDNT MAKE NEW PLAYLIST FOR THIS SERVER" + error)
    });

})


client.on("messageCreate", async (message) => {


    // console.log(message);

    if (message.author.bot) 
        return false;
    


    console.log(`Message from ${
        message.author.username
    }: ${
        message.content
        // log users who added songs for statistics later
    }`);

    if (message.content === "!playlistbot ") {
        message.reply("hi there")
    }

    if (message.content.startsWith('!rmvsong') || message.content.startsWith('!rmvSong')) {

        var spotifyUris = getURIS(message.content);

        console.log("removing song")

        // message.guildId
        axios.delete((process.env.API_URL + "playlists/" + message.guildId + "/songs"), {
            data: {
                "spotify_tracks": spotifyUris
            }
        }).then(res => {
            console.log(res.status);
        }).catch(error => {
            console.log("ERROR " + error)
        });

    }

    if (message.content.includes('https://open.spotify.com/track/')) { // parsing  spotify track uri

        console.log("adding song")

        var spotifyUris = getURIS(message.content);

        // message.guildId
        
        addSongs(message, spotifyUris);



    }

    if (message.content.includes('!help' || '!Help')) {

        message.channel.send("**Command List**:\n**!help** thats this!\n**!updatePlaylist** Searches this channel for songs to add\n**!rmvSong** *[song url]* Remove a specific song from the playlist using a song link\n**!playlist** The link to your server playlist");

    }

    if (message.content.includes('!playlist' || '!Playlist')) {

        axios.get((process.env.API_URL + "playlists/" + message.guildId)).then(res => {

            let uri = res.data._id;
            message.channel.send('https://open.spotify.com/playlist/' + uri);

        }).catch(error => {

            message.channel.send("No Playlist found. Run **!updatePlaylist** to start one. ")

        });
    }


    if (message.content.includes('!updatePlaylist' || '!updateplaylist')) {

        //message.reply("Sorry! This is gonna take a second. Scanning this channel for spotify songs");

        limit = 100;
        console.log("HERE")
        // array of up to 100 uri's per element
        var result = [];
        var uris = [];

        let z = 0;
        let last_id;


        while (true) {

            const options = {
                limit: 100
            };

            if (last_id) {
                options.before = last_id;
            }

            const messages = await message.channel.messages.fetch(options)
                .then(messages => {

                    let tmpMsg = "";
                    let i = 0;
                   

                    while (i < 100) {
                        try {
                            tmpMsg = messages.at(i).content;
                        } catch (e) {
                            console.log(e);
                        }


                        if (tmpMsg.includes('https://open.spotify.com/track/')) {

                            let tmpUriArray = getURIS(tmpMsg)

                            for (let x in tmpUriArray) {

                                if (uris.length<=99)
                                uris.push(tmpUriArray[x])
                            
                            else{
                                result[z]=uris;
                                uris = [];
                                z++;
                            }
                        }

                    }
                    i++;
                }

                return messages;

            });

            
            last_id = messages.last().id;

            if (messages.size != 100 ) {
                break;
            }

        }

        for(j in result){
            console.log(j);
            /*
            axios.post(
                (process.env.API_URL + "playlists/" + message.guildId + "/songs"),
                 {"spotify_tracks": result[j]}
            ).then(res => {
                console.log(res.status);
            }) .catch(error => {
                console.log("ERROR " + error)
            });
            */
            addSongs(message, result[j])                


            }

                            console.log(result);

                            axios.get((process.env.API_URL + "playlists/" + message.guildId)).then(res => {

                                let uri = res.data._id;
                                //message.reply('https://open.spotify.com/playlist/' + uri);

                            }).catch(error => {

                                //message.reply("No Playlist found. Run **!updatePlaylist** to start one. ")

                            });


                        }

                    }
                );


            client.login(process.env.BOT_TOKEN)

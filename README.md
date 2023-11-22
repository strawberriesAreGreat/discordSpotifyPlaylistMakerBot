# discordSpotifyPlaylistMakerBot

A discord python bot that communicates with a custom built api that handles
spotify playlist creation and handling

# Structure

Whats spotify API's rate limit?

# TODO

## TESTS

1. [x] Fix unit tests in `src/middleware/tests/unit/spotifyAuthCallback.test.ts`

## Auth flow

1. [ ] refresh auth token if user auth token is expired
2. [ ] asking user to re-authorize if they are in DB but their spotify auth

## Bot added to server

1. [ ] create new server entry

## Song is added to channel

1. [ ] if user doesn't exist, create new user in DB
2. [ ] add song element

## Commands

1. [ ] create playlist
2. [ ] add songs to playlist
3. [ ] auto update playlist once per day for all users on the server
4. [ ] update playlist manually based on user command
5. [ ]

## Features

## Error Handeling

1. [ ] throw all errors
2. [ ] catch by error catcher at root of app 2.1. [ ] if fault == USER,
       translate message to user in DMs. 2.2. [ ] if fault == INTERNAL, emoji
       react with robot and skull (app is having issues) 2.3 [ ] if fault ==
       DISCORD ?? 2.4. [ ] if fault == SPOTIFY >> add traslation layer based on
       their responses
       [Documentation](https://developer.spotify.com/documentation/web-api/concepts/api-calls)

# discordSpotifyPlaylistMakerBot

A discord python bot that communicates with a custom built api that handles
spotify playlist creation and handling

# Structure

├── src/ │ ├── api/ │ │ ├── spotify.ts │ │ └── discord.ts │ ├── models/ │ │ ├──
DiscordUser.ts │ │ └── SpotifyToken.ts │ ├── services/ │ │ ├──
DiscordAuthService.ts │ │ └── SpotifyAuthService.ts │ ├── utils/ │ │ ├──
encryption.ts │ │ └── errors.ts │ ├── app.ts │ └── index.ts ├── test/ │ ├── api/
│ ├── models/ │ ├── services/ │ └── utils/ ├── node_modules/ ├── package.json
├── tsconfig.json └── README.md

# TODO

1. [ ] Fix unit tests in `src/middleware/tests/unit/spotifyAuthCallback.test.ts`

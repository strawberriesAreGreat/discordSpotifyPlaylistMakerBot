### TODOs
| Filename | line # | TODO |
|:------|:------:|:------|
| [src/middleware/db/saveTokenToDb.ts](src/middleware/db/saveTokenToDb.ts#L14) | 14 | edit function, its bad that discordUserId is optional and that this function has 2 input cases |
| [src/middleware/discord/discordCommand.ts](src/middleware/discord/discordCommand.ts#L53) | 53 | review how userNotFound is being swallowed and replaced with UnauthorizedDiscordCommand |
| [src/utils/errors/DatabaseErrors.ts](src/utils/errors/DatabaseErrors.ts#L16) | 16 | This should be faulttype.INTERNAL, unauthorized user should never be able to reach this point. |
| [src/middleware/discord/commands/addSong.ts](src/middleware/discord/commands/addSong.ts#L1) | 1 | Add single song to playlist |
| [src/middleware/discord/commands/help.ts](src/middleware/discord/commands/help.ts#L1) | 1 | iterate through command-dictionary and generate a list of commands |
| [src/middleware/discord/commands/removeSong.ts](src/middleware/discord/commands/removeSong.ts#L1) | 1 | Removes song from playlist |

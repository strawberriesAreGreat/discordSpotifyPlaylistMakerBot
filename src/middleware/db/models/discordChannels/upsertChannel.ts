import * as TE from 'fp-ts/TaskEither';
import { DatabaseError } from '../../../../utils/errors';
import { DiscordChannels } from './DiscordChannels';

export const upsertChannel = (serverId: number, channel: string) =>
  TE.tryCatch<Error, DiscordChannels>(
    async () => {
      const [channelEntry, created] = await DiscordChannels.findOrCreate({
        where: { serverId: serverId, channelHash: channel },
      });
      return channelEntry;
    },
    (error) => new DatabaseError(error as Error)
  );

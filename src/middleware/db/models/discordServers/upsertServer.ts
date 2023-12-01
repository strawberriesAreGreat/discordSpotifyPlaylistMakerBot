import * as TE from 'fp-ts/TaskEither';
import { DatabaseError } from '../../../../utils/errors';
import { DiscordServers } from './DiscordServers';
import { HashedString } from '../../../../utils/types';

export const upsertServer = (serverID: HashedString) =>
  TE.tryCatch<Error, DiscordServers>(
    async () => {
      const [server, created] = await DiscordServers.findOrCreate({
        where: { serverHash: serverID },
      });
      return server;
    },
    (error) => new DatabaseError(error as Error)
  );

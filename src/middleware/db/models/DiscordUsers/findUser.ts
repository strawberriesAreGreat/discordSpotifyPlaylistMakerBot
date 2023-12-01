import * as TE from 'fp-ts/TaskEither';
import { DatabaseError, UserNotFoundError } from '../../../../utils/errors';
import { HashedString } from '../../../../utils/types';
import { DiscordUsers } from './DiscordUsers';

export const findUser = (user: HashedString) =>
  TE.tryCatch<Error, DiscordUsers>(
    async () => {
      const userEntry = await DiscordUsers.findOne({
        where: { userHash: user },
      });
      return userEntry != null
        ? userEntry
        : Promise.reject(new UserNotFoundError());
    },
    (error) => new DatabaseError(error as Error)
  );

import { getUser } from '../getUser';
import { Message } from 'discord.js';
import { DiscordUser } from '../../../models';
import { pipe } from 'fp-ts/lib/function';
import { DatabaseError, UserNotFoundError } from '../../../utils/errors';
import { hashDiscordId } from '../../../services/encryption';

describe('getUser', () => {
  const discordId = 'testDiscordId';
  const message: Message = {
    author: {
      id: discordId,
    },
  } as Message;
  const hashedId = hashDiscordId(discordId);
  const user = { discord_id: hashedId } as unknown as DiscordUser;

  it('should return a user if one exists', async () => {
    jest.spyOn(DiscordUser, 'findOne').mockResolvedValueOnce(user);

    const result = await pipe(getUser(message))();

    expect(result).toEqual({
      _tag: 'Right',
      right: [user, message],
    });
  });

  it('should return a UserNotFoundError if no user exists', async () => {
    jest.spyOn(DiscordUser, 'findOne').mockResolvedValueOnce(null);

    const result = await pipe(getUser(message))();

    expect(result).toEqual({
      _tag: 'Left',
      left: new UserNotFoundError(),
    });
  });

  it('should return a DatabaseError if an error occurs', async () => {
    const error = new Error('test error');
    jest.spyOn(DiscordUser, 'findOne').mockRejectedValueOnce(error);

    const result = await pipe(getUser(message))();

    expect(result).toEqual({
      _tag: 'Left',
      left: new DatabaseError(String(error)),
    });
  });
});

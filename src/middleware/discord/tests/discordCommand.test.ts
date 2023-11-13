jest.mock('../../../models/DiscordUser');
jest.mock('../../../models/SpotifyToken');
jest.mock('../../../services');
jest.mock('../../db/db');
const fooCommand = /^!foo/;
const barCommand = /^!bar/;

jest.mock('../commandDictionary', () => ({
  registeredUserCommandMap: new Map([[fooCommand, jest.fn()]]),
  unregisteredUserCommandMap: new Map([[barCommand, jest.fn()]]),
}));

import { runCommand } from '../discordCommand';
import { Message } from 'discord.js';
import * as E from 'fp-ts/Either';
import { CommandNotFoundError } from '../../../utils/errors';
import { registeredUserCommandMap } from '../commandDictionary';

describe('runCommand', () => {
  const mockUser = { id: '123', username: 'testUser' };
  const mockMessageWithAuthUser = { content: '!foo' } as Message;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // should return a CommandNotFoundError if the command is not found
  it('should return a CommandNotFoundError if the command is not found', async () => {
    const mockMessage = { content: '!fakeCommand' } as Message;
    const result = await runCommand([mockUser as any, mockMessage])();
    expect(E.isLeft(result)).toBe(true);
    expect(result._tag).toBe('Left');
    E.fold(
      (error) => expect(error).toBeInstanceOf(CommandNotFoundError),
      () => fail('Expected a Left, but got a Right')
    )(result);
  });

  // authorized user trying to call authorized command should work
  it('should call the authorized user command if the command is found', async () => {
    const commandFunction = registeredUserCommandMap.get(fooCommand);

    const result = await runCommand([
      mockUser as any,
      mockMessageWithAuthUser,
    ])();

    expect(E.isRight(result)).toBe(true);
    expect(result._tag).toBe('Right');
    E.fold(
      (error) => fail('Expected a Right, but got a Left with error: ' + error),
      (result) => expect(result).toEqual(undefined)
    )(result);
    expect(commandFunction).toHaveBeenCalledWith(
      mockUser,
      mockMessageWithAuthUser
    );
  });

  // unauthorized user trying to call authorized command should fail
  it('should not call the authorized user command with unauthorized user', async () => {
    const result = await runCommand([null, mockMessageWithAuthUser])();

    expect(E.isLeft(result)).toBe(true);
    expect(result._tag).toBe('Left');
    E.fold(
      (error) => expect(error).toBeInstanceOf(CommandNotFoundError),
      () => fail('Expected a Left, but got a Right')
    )(result);
  });
});

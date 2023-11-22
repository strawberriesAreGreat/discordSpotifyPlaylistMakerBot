const authCommand = /^!authCommand/;
const noAuthCommand = /^!noAuthCommand/;

jest.mock('../commandDictionary', () => ({
  registeredUserCommandMap: new Map([
    [authCommand, { execute: jest.fn(), requiresUser: true }],
  ]),
  unregisteredUserCommandMap: new Map([
    [noAuthCommand, { execute: jest.fn(), requiresUser: false }],
  ]),
}));
jest.mock('../../../models/DiscordUsers');
jest.mock('../../../models/SpotifyCredentials');
jest.mock('../../../services');
jest.mock('../../db/db');
jest.mock('../../db/getUser', () => {
  const TE = require('fp-ts/lib/TaskEither');
  return {
    getUser: jest.fn((message) => TE.of([undefined, message])),
  };
});
import { compileArgs, getCommand } from '../discordCommand';
import { Message } from 'discord.js';
import {
  CommandNotFoundError,
  UnauthorizedDiscordCommand,
  UserNotFoundError,
} from '../../../utils/errors';
import {
  registeredUserCommandMap,
  unregisteredUserCommandMap,
} from '../commandDictionary';
import { DiscordUsers } from '../../../models';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { DiscordUserData } from '../../../utils/types/interfaces';

describe('runCommand', () => {
  const mockUser = { id: 123 } as DiscordUsers;
  const mockMessageWithAuthUser = { content: '!authCommand' } as Message;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Return a CommandNotFoundError if the command is not found', async () => {
    const mockMessage = { content: '!fakeCommand' } as Message;

    const result = await getCommand({
      message: mockMessage,
    } as DiscordUserData)();
    expect(E.isLeft(result)).toBe(true);
    expect(result._tag).toBe('Left');
    E.fold(
      (error) => expect(error).toBeInstanceOf(CommandNotFoundError),
      () => fail('Expected a Left, but got a Right')
    )(result);
  });

  it('Unauthorized user trying to call authorized command should throw UnauthorizedDiscordCommand', async () => {
    const { getUser } = require('../../db/getUser');
    getUser.mockImplementation((mockMessage: Message) =>
      TE.left(new UserNotFoundError())
    );

    const mockMessage = {
      author: { id: '918' },
      content: '!authedCommand',
      channel: { send: jest.fn() },
    } as unknown as Message;

    const commandFunction = registeredUserCommandMap.get(authCommand);

    const result = await compileArgs({
      message: mockMessage,
      command: commandFunction,
    } as DiscordUserData)();

    expect(E.isLeft(result)).toBe(true);
    expect(result._tag).toBe('Left');
    E.fold(
      (error) => expect(error).toBeInstanceOf(UnauthorizedDiscordCommand),
      () => fail('Expected a Left, but got a Right')
    )(result);
  });

  it('Unauthorized user trying to call unauthorized command should run command', async () => {
    const { getUser } = require('../../db/getUser');
    getUser.mockImplementation(
      (mockMessage: Message) => new UserNotFoundError()
    );

    const mockMessage = {
      author: { id: '918' },
      content: '!noAuthCommand',
      channel: { send: jest.fn() },
    } as unknown as Message;

    const commandFunction = unregisteredUserCommandMap.get(noAuthCommand);

    const result = await compileArgs({
      message: mockMessage,
      command: commandFunction,
    } as DiscordUserData)();

    expect(E.isRight(result)).toBe(true);
    expect(result._tag).toBe('Right');
    E.fold(
      () => fail('Expected a Right, but got a Left'),
      (result) =>
        // Note that no user is returned for auth command that doesn't require auth
        expect(result).toEqual({
          message: mockMessage,
          command: commandFunction,
        })
    )(result);
  });

  it('Authorized user trying to call authorized command should run command', async () => {
    const { getUser } = require('../../db/getUser');
    getUser.mockImplementation((mockMessage: Message) => TE.of(mockUser));

    const mockMessage = {
      author: { id: '918' },
      content: '!authedCommand',
      channel: { send: jest.fn() },
    } as unknown as Message;

    const commandFunction = registeredUserCommandMap.get(authCommand);

    const result = await compileArgs({
      message: mockMessage,
      command: commandFunction,
    } as DiscordUserData)();

    expect(E.isRight(result)).toBe(true);
    expect(result._tag).toBe('Right');
    E.fold(
      () => fail('Expected a Right, but got a Left'),
      (result) =>
        expect(result).toEqual({
          message: mockMessage,
          command: commandFunction,
          user: mockUser,
        })
    )(result);
  });

  it('Authorized user trying to call unauthorized command should run command', async () => {
    const { getUser } = require('../../db/getUser');
    getUser.mockImplementation((mockMessage: Message) =>
      TE.of([mockUser, mockMessage])
    );

    const mockMessage = {
      author: { id: '918' },
      content: '!noAuthCommand',
      channel: { send: jest.fn() },
    } as unknown as Message;

    const commandFunction = unregisteredUserCommandMap.get(noAuthCommand);

    const result = await compileArgs({
      message: mockMessage,
      command: commandFunction,
    } as DiscordUserData)();

    expect(E.isRight(result)).toBe(true);
    expect(result._tag).toBe('Right');
    E.fold(
      () => fail('Expected a Right, but got a Left'),
      (result) =>
        // Note that no user is returned for auth command that doesn't require auth
        expect(result).toEqual({
          message: mockMessage,
          command: commandFunction,
        })
    )(result);
  });
});

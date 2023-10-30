jest.useFakeTimers();
import { InvalidUrlError } from '../../../utils/errors';
import { validateUrl, saveTokenDataToDb } from '../spotifyAuthCallback';
import { IncomingMessage } from 'http';
import { DiscordUser } from '../../../models/DiscordUser';
import { SpotifyToken } from '../../../models/SpotifyToken';
import { decryptString } from '../../../services';

jest.mock('../../../models/DiscordUser');
jest.mock('../../../models/SpotifyToken');
jest.mock('../../../services');

describe('parseUrl', () => {
  it('should return a TaskEither with the request object if the URL is valid', () => {
    const req = {
      url: '/callback',
      method: 'GET',
    } as IncomingMessage;
    expect(validateUrl(req)()).resolves.toEqual({
      _tag: 'Right',
      right: req,
    });
  });
  it('should throw an error for recevieing a favcon url', () => {
    const req = {
      url: '/favcon.ico',
      method: 'GET',
    } as IncomingMessage;
    expect(validateUrl(req)()).resolves.toEqual({
      _tag: 'Left',
      left: new InvalidUrlError(),
    });
  });
  it('should return a TaskEither with an InvalidUrlError if invalid URL is sent', () => {
    const req = {
      url: 'tincan.com:8888/callback?code=AQDKHMDpMp_zIb06Vkao',
      method: 'GET',
    } as IncomingMessage;
    expect(validateUrl(req)()).resolves.toEqual({
      _tag: 'Left',
      left: new InvalidUrlError(),
    });
  });
});

describe('saveTokenDataToDb()', () => {
  const mockDiscordUserID = '123456789';
  const mockEncryptedState = 'my-encrypted-state';
  const mockAccessToken = 'my-access-token';
  const mockRefreshToken = 'my-refresh-token';
  const mockScope = 'my-scope';
  const mockExpiresIn = 3600;
  const mockUser = {
    id: 1,
    discordId: mockDiscordUserID,
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();
  });

  it('should create a new DiscordUser and SpotifyToken record', async () => {
    // Set up mock dependencies
    (decryptString as jest.Mock).mockReturnValue(mockDiscordUserID);
    (DiscordUser.findOne as jest.Mock).mockResolvedValue(null);
    (DiscordUser.create as jest.Mock).mockResolvedValue(mockUser);
    (SpotifyToken.create as jest.Mock).mockResolvedValue(undefined);

    // Call saveTokenDataToDb() with mock data
    const result = await saveTokenDataToDb({
      requestState: mockEncryptedState,
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      scope: mockScope,
      expires_in: mockExpiresIn,
    })();

    // Verify that DiscordUser.findOne() was called with the correct arguments
    expect(DiscordUser.findOne).toHaveBeenCalledWith({
      where: {
        discordId: mockDiscordUserID,
      },
    });

    // Verify that DiscordUser.create() was called with the correct arguments
    expect(DiscordUser.create).toHaveBeenCalledWith({
      discordId: mockDiscordUserID,
    });

    //Verify that SpotifyToken.create() was called with the correct arguments
    expect(SpotifyToken.create).toHaveBeenCalledWith({
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      scope: mockScope,
      expires_in: mockExpiresIn,
      discord_user_id: mockDiscordUserID,
      discordId: mockDiscordUserID,
    });

    // // Verify that saveTokenDataToDb() returned a Right value
    expect(result._tag).toEqual('Right');
  });

  it('should return a Left value if an error occurs', async () => {
    // Set up mock dependencies to throw an error
    (decryptString as jest.Mock).mockReturnValue(mockDiscordUserID);
    (DiscordUser.findOne as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    // Call saveTokenDataToDb() with mock data
    const result = await saveTokenDataToDb({
      requestState: mockEncryptedState,
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      scope: mockScope,
    })();

    // Verify that DiscordUser.findOne() was called with the correct arguments
    expect(DiscordUser.findOne).toHaveBeenCalledWith({
      where: {
        discordId: mockDiscordUserID,
      },
    });

    // Verify that DiscordUser.create() and SpotifyToken.create() were not called
    expect(DiscordUser.create).not.toHaveBeenCalled();
    expect(SpotifyToken.create).not.toHaveBeenCalled();

    // Verify that saveTokenDataToDb() returned a Left value with the error
    expect(result._tag).toEqual('Left');
  });
});

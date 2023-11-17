jest.mock('../../../models/DiscordUsers');
jest.mock('../../../models/SpotifyTokens');
jest.mock('../../../services');
jest.mock('../db');

import { DiscordUsers } from '../../../models/DiscordUsers';
import SpotifyTokens from '../../../models/SpotifyTokens';
import { decryptString, hashDiscordId } from '../../../services';
import { EncryptedString } from '../../../utils/types';
import { saveTokenDataToDb } from '../saveTokenToDb';

describe('saveTokenDataToDb()', () => {
  const mockDiscordUserID = '123456789';
  const mockHashedDiscordId: EncryptedString =
    'hashed-discord-id' as EncryptedString;
  const mockEncryptedState: EncryptedString =
    'encrypted-state' as EncryptedString;
  const mockEncryptedAccessToken: EncryptedString =
    'access-token' as EncryptedString;
  const mockEncryptedRefreshToken: EncryptedString =
    'refresh-token' as EncryptedString;
  const mockScope = 'my-scope';
  const mockExpiresIn = 3600;
  const mockUser = {
    id: 1,
    discordId: mockHashedDiscordId,
  };
  const mockSpotifyToken = {
    id: 1,
    access_token: mockEncryptedAccessToken,
    refresh_token: mockEncryptedRefreshToken,
    scope: mockScope,
    token_expiry: mockExpiresIn,
    token_expiry_timestamp: expect.any(Date),
    discord_user_id: mockHashedDiscordId,
  };

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Reset mock implementations before each test
    originalEnv = { ...process.env };
    process.env.ENCRYPTION_SECRET = 'mock_secret';
    jest.clearAllMocks();
  });

  it('should create a new DiscordUser and SpotifyToken record', async () => {
    (hashDiscordId as jest.Mock).mockReturnValue(mockHashedDiscordId);
    (decryptString as jest.Mock).mockReturnValue(mockDiscordUserID);
    (DiscordUsers.findOne as jest.Mock).mockResolvedValue(null);
    (DiscordUsers.create as jest.Mock).mockResolvedValue(mockUser);
    (SpotifyTokens.findOne as jest.Mock).mockResolvedValue(null);
    (SpotifyTokens.create as jest.Mock).mockResolvedValue(mockSpotifyToken);

    // Call saveTokenDataToDb() with mock data
    const result = await saveTokenDataToDb({
      state: mockEncryptedState,
      access_token: mockEncryptedAccessToken,
      refresh_token: mockEncryptedRefreshToken,
      scope: mockScope,
      expires_in: mockExpiresIn,
    })();

    expect(DiscordUsers.findOne).toHaveBeenCalledWith({
      where: {
        discordId: mockHashedDiscordId,
      },
    });

    expect(DiscordUsers.create).toHaveBeenCalledWith({
      discordId: mockHashedDiscordId,
    });

    expect(SpotifyTokens.create).toHaveBeenCalledWith({
      access_token: mockEncryptedAccessToken,
      refresh_token: mockEncryptedRefreshToken,
      scope: mockScope,
      token_expiry: mockExpiresIn,
      discord_user_id: mockHashedDiscordId,
      token_expiry_timestamp: expect.any(Date),
    });

    expect(decryptString).toHaveBeenCalledWith(
      mockEncryptedState,
      process.env.ENCRYPTION_SECRET
    );
    expect(hashDiscordId).toHaveBeenCalledWith(mockDiscordUserID);

    expect(result._tag).toEqual('Right');
  });

  it('should return a Left value if an error occurs', async () => {
    (hashDiscordId as jest.Mock).mockReturnValue(mockHashedDiscordId);
    (decryptString as jest.Mock).mockReturnValue(mockDiscordUserID);
    (DiscordUsers.findOne as jest.Mock).mockRejectedValue(
      new Error('sorry pal but i have to throw an error')
    );

    const result = await saveTokenDataToDb({
      state: mockEncryptedState,
      access_token: mockEncryptedAccessToken,
      refresh_token: mockEncryptedRefreshToken,
      scope: mockScope,
    })();

    // Verify that DiscordUser.findOne() was called with the correct arguments
    expect(DiscordUsers.findOne).toHaveBeenCalledWith({
      where: {
        discordId: mockHashedDiscordId,
      },
    });

    // Verify that DiscordUser.create() and SpotifyToken.create() were not called
    expect(DiscordUsers.create).not.toHaveBeenCalled();
    expect(SpotifyTokens.create).not.toHaveBeenCalled();

    // Verify that saveTokenDataToDb() returned a Left value with the error
    expect(result._tag).toEqual('Left');
  });
});

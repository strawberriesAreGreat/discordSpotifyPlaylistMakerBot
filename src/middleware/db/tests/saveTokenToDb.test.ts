import DiscordUser from '../../../models/DiscordUser';
import SpotifyToken from '../../../models/SpotifyToken';
import { decryptString, hashDiscordId } from '../../../services';
import { EncryptedString } from '../../../utils/types';
import { saveTokenDataToDb } from '../saveTokenToDb';

jest.mock('../../../models/DiscordUser');
jest.mock('../../../models/SpotifyToken');
jest.mock('../../../services');

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

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Reset mock implementations before each test
    originalEnv = { ...process.env };
    process.env.ENCRYPTION_SECRET = 'mock_secret';
    jest.clearAllMocks();
  });

  it('should create a new DiscordUser and SpotifyToken record', async () => {
    // Set up mock dependencies
    (decryptString as jest.Mock).mockReturnValue(mockDiscordUserID);
    (hashDiscordId as jest.Mock).mockReturnValue(mockHashedDiscordId);
    (DiscordUser.findOne as jest.Mock).mockResolvedValue(null);
    (DiscordUser.create as jest.Mock).mockResolvedValue(mockUser);
    (SpotifyToken.create as jest.Mock).mockResolvedValue(undefined);

    // Call saveTokenDataToDb() with mock data
    const result = await saveTokenDataToDb({
      state: mockEncryptedState,
      access_token: mockEncryptedAccessToken,
      refresh_token: mockEncryptedRefreshToken,
      scope: mockScope,
      expires_in: mockExpiresIn,
    })();

    // Verify that DiscordUser.findOne() was called with the correct arguments
    expect(DiscordUser.findOne).toHaveBeenCalledWith({
      where: {
        discordId: mockHashedDiscordId,
      },
    });

    // Verify that DiscordUser.create() was called with the correct arguments
    expect(DiscordUser.create).toHaveBeenCalledWith({
      discordId: mockHashedDiscordId,
    });

    //Verify that SpotifyToken.create() was called with the correct arguments
    expect(SpotifyToken.create).toHaveBeenCalledWith({
      access_token: mockEncryptedAccessToken,
      refresh_token: mockEncryptedRefreshToken,
      scope: mockScope,
      token_expiry: mockExpiresIn,
      discord_user_id: mockHashedDiscordId,
      token_expiry_timestamp: new Date(Date.now() + mockExpiresIn * 1000 - 1),
    });

    expect(decryptString).toHaveBeenCalledWith(
      mockEncryptedState,
      process.env.ENCRYPTION_SECRET
    );
    expect(hashDiscordId).toHaveBeenCalledWith(mockDiscordUserID);

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
      state: mockEncryptedState,
      access_token: mockEncryptedAccessToken,
      refresh_token: mockEncryptedRefreshToken,
      scope: mockScope,
    })();

    // Verify that DiscordUser.findOne() was called with the correct arguments
    expect(DiscordUser.findOne).toHaveBeenCalledWith({
      where: {
        discordId: mockHashedDiscordId,
      },
    });

    // Verify that DiscordUser.create() and SpotifyToken.create() were not called
    expect(DiscordUser.create).not.toHaveBeenCalled();
    expect(SpotifyToken.create).not.toHaveBeenCalled();

    // Verify that saveTokenDataToDb() returned a Left value with the error
    expect(result._tag).toEqual('Left');
  });
});

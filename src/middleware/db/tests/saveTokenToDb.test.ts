jest.mock('../../../models/DiscordUsers');
jest.mock('../../../models/SpotifyCredentials');
jest.mock('../../../services');
jest.mock('../db');

import { DiscordUsers } from '../models/DiscordUsers/DiscordUsers';
import { SpotifyCredentials } from '../models/spotifyCredentials/SpotifyCredentials';
import { decryptString, hashDiscordId } from '../../../services';
import {
  EncryptedString,
  HashedString,
  SpotifyTokenData,
} from '../../../utils/types';
import { saveTokenDataToDb } from '../saveTokenToDb';

describe('saveTokenDataToDb()', () => {
  const discordUserID = '123456789';
  const hashedDiscordId = 'hashedDiscordId' as HashedString;
  const encryptedState = 'encryptedState' as EncryptedString;
  const encryptedAccessToken = 'accessToken' as EncryptedString;
  const encryptedRefreshToken = 'refreshYoken' as EncryptedString;
  const scope = 'scope';
  const expiresIn = 3600;
  const tokenType = 'tokenType';
  const timeNow = new Date(Date.now() + expiresIn * 1000);

  const mockUser = {
    id: 55,
    discordId: hashedDiscordId,
  };

  const mockSpotifyToken = {
    id: 1,
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
    scope: scope,
    tokenExpiry: expiresIn,
    tokenExpiryTimestamp: timeNow,
    discordUserId: mockUser.id,
  };

  const tokenDataWithoutState: SpotifyTokenData = {
    scope: scope,
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
    tokenExpiry: expiresIn,
    tokenExpiryTime: timeNow,
    tokenType: tokenType,
  };

  const tokenDataWithState: SpotifyTokenData = {
    state: encryptedState,
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
    scope: scope,
    tokenExpiry: expiresIn,
    tokenExpiryTime: timeNow,
    tokenType: tokenType,
  };

  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.ENCRYPTION_SECRET = 'mock_secret';
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a new DiscordUser and SpotifyToken record using state', async () => {
    (hashDiscordId as jest.Mock).mockReturnValue(hashedDiscordId);
    (decryptString as jest.Mock).mockReturnValue(discordUserID);
    (DiscordUsers.upsert as jest.Mock).mockResolvedValue([mockUser, true]);
    (SpotifyCredentials.upsert as jest.Mock).mockResolvedValue([
      mockSpotifyToken,
      true,
    ]);

    const result = await saveTokenDataToDb(tokenDataWithState)();

    expect(hashDiscordId).toHaveBeenCalled();
    expect(decryptString).toHaveBeenCalled();
    expect(DiscordUsers.upsert).toHaveBeenCalledWith({
      discordId: hashedDiscordId,
    });

    expect(SpotifyCredentials.upsert).toHaveBeenCalledWith({
      userId: mockUser.id,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      scope: scope,
      tokenExpiry: expiresIn,
      tokenExpiryTimestamp: timeNow,
      tokenType: tokenType,
    });

    expect(result._tag).toEqual('Right');
  });

  it('should create a new DiscordUser and SpotifyToken record with DiscordId', async () => {
    (DiscordUsers.upsert as jest.Mock).mockResolvedValue([mockUser, true]);
    (SpotifyCredentials.upsert as jest.Mock).mockResolvedValue([
      mockSpotifyToken,
      true,
    ]);

    const result = await saveTokenDataToDb(
      tokenDataWithoutState,
      hashedDiscordId
    )();

    expect(hashDiscordId).not.toHaveBeenCalled();
    expect(decryptString).not.toHaveBeenCalled();

    expect(DiscordUsers.upsert).toHaveBeenCalledWith({
      userHash: hashedDiscordId,
    });

    expect(SpotifyCredentials.upsert).toHaveBeenCalledWith({
      userId: mockUser.id,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      scope: scope,
      tokenExpiry: expiresIn,
      tokenExpiryTimestamp: timeNow,
      tokenType: tokenType,
    });

    expect(result._tag).toEqual('Right');
  });

  it('should throw an error when no state or userID are passed in', async () => {
    const result = await saveTokenDataToDb(tokenDataWithoutState)();
    expect(hashDiscordId).not.toHaveBeenCalled();
    expect(decryptString).not.toHaveBeenCalled();
    expect(DiscordUsers.upsert).not.toHaveBeenCalled();
    expect(SpotifyCredentials.upsert).not.toHaveBeenCalled();
  });
});

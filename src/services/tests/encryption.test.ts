import { DiscordId } from '../../utils/types';
import { decrypt, encrypt } from '../encryption';
import crypto from 'crypto';

describe('encrpt discordID', () => {
  const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');

  const discordId: DiscordId = '1234567890';
  const encryptedState = encrypt(discordId, ENCRYPTION_KEY);
  const decryptedState = decrypt(encryptedState, ENCRYPTION_KEY);

  it('should encrypt a string', () => {
    expect(encryptedState).not.toEqual(discordId);
  });

  it('should decrypt a string', () => {
    expect(decryptedState).not.toEqual(null || undefined || encryptedState);
  });

  it('the encryppted and decrypted strng should match', () => {
    expect(decryptedState).toEqual(discordId);
  });
});

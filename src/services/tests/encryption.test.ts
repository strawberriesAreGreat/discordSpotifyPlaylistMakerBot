import { decryptString, encryptString, hashDiscordId } from '../encryption';
import crypto from 'crypto';

describe('encrpt strings', () => {
  const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');

  const someString = '1234567890';
  const encryptedState = encryptString(someString, ENCRYPTION_KEY);
  const decryptedState = decryptString(encryptedState, ENCRYPTION_KEY);

  it('should encrypt a string', () => {
    expect(encryptedState).not.toEqual(someString);
  });

  it('should decrypt a string', () => {
    expect(decryptedState).not.toEqual(null || undefined || encryptedState);
  });

  it('the encryppted and decrypted strng should match', () => {
    expect(decryptedState).toEqual(someString);
  });
});

describe('hashDiscordId', () => {
  it('should return a hashed string', () => {
    const discordId = 'testDiscordId';
    const hashedId = hashDiscordId(discordId);
    expect(hashedId).toBeDefined();
    expect(hashedId).not.toEqual(discordId);
  });
});

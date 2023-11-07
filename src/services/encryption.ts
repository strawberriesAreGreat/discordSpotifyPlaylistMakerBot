import crypto from 'crypto';
import { EncryptedString, HashedString } from '../utils/types/enums';
const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;
let iv = crypto.randomBytes(IV_LENGTH);

// Takes a string and an encryption key and returns an encrypted string
export function encryptString(
  stringToEncrypt: string,
  ENCRYPTION_KEY: string
): EncryptedString {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encryptedString = cipher.update(stringToEncrypt);
  encryptedString = Buffer.concat([encryptedString, cipher.final()]);
  return (iv.toString('hex') +
    ':' +
    encryptedString.toString('hex')) as EncryptedString;
}

// Takes an encrypted string and an encryption key and returns a decrypted string
export function decryptString(
  encryptedString: EncryptedString,
  ENCRYPTION_KEY: string
): string {
  let textParts = encryptedString.split(':');
  let iv = Buffer.from(textParts.shift() as string, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export function hashDiscordId(discordId: string): HashedString {
  let PEPPER = process.env.PEPPER as string;
  const salt = crypto
    .createHash('sha256')
    .update(discordId + PEPPER)
    .digest('hex');
  const hashedId = crypto
    .pbkdf2Sync(discordId, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hashedId as HashedString;
}

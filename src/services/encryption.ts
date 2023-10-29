import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;
let iv = crypto.randomBytes(IV_LENGTH);

// Takes a string and an encryption key and returns an encrypted string
export function encrypt(state: string, ENCRYPTION_KEY: string): string {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encryptedState = cipher.update(state);
  encryptedState = Buffer.concat([encryptedState, cipher.final()]);
  return iv.toString('hex') + ':' + encryptedState.toString('hex');
}

// Takes an encrypted string and an encryption key and returns a decrypted string
export function decrypt(
  encryptedState: string,
  ENCRYPTION_KEY: string
): string {
  let textParts = encryptedState.split(':');
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

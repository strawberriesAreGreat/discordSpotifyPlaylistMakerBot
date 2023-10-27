import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.SECRET as string;
const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;
let iv = crypto.randomBytes(IV_LENGTH);

export function encrypt(state: string): string {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );

  let encryptedState = cipher.update(state);
  encryptedState = Buffer.concat([encryptedState, cipher.final()]);
  return iv.toString('hex') + ':' + encryptedState.toString('hex');
}

export function decrypt(encryptedState: string): string {
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

type EncryptedString = string & { __brand: 'encrypted' };
type HashedString = string & { __brand: 'hashed' };

export type { EncryptedString, HashedString };

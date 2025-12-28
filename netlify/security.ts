import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const ENCRYPTION_KEY = loadKey();
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function loadKey(): Buffer {
  try {
    const key = process.env.APP_KEY;

    if (!key) throw new Error('APP_KEY is not set.');

    const buf = Buffer.from(key, 'hex');

    if (buf.length !== KEY_LENGTH) throw new Error(`APP_KEY must be 32 bytes (64 hex chars)`);

    return buf;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to load encryption key.');
  }
}

export function encrypt(plain: Buffer): Buffer {
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, ciphertext]);
}

export function decrypt(payload: Buffer): Buffer {
  if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid encrypted payload');
  }

  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

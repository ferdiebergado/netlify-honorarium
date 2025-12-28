import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from './security';

describe('encrypt and decrypt', () => {
  it('encrypts and decrypts text successfully', () => {
    const want = 'hello';
    const plain = Buffer.from(want, 'utf-8');
    const encrypted = encrypt(plain);
    const decrypted = decrypt(encrypted);

    expect(decrypted.toString('utf-8')).toEqual(want);
  });

  it('encrypts and decrypts object successfully', () => {
    const want = {
      id: 1,
      message: 'hello',
    };

    const plain = Buffer.from(JSON.stringify(want), 'utf-8');
    const encrypted = encrypt(plain);
    const decrypted = decrypt(encrypted);

    expect(JSON.parse(decrypted.toString('utf-8'))).toEqual(want);
  });
});

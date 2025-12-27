import { toBuffer } from './lib';
import type { AccountDetails } from './list-accounts';
import { decrypt } from './security';

export function deserializeDetails(serialized: Buffer): AccountDetails {
  const decrypted = decrypt(toBuffer(serialized));
  const payload = decrypted.toString('utf-8');

  return JSON.parse(payload) as AccountDetails;
}

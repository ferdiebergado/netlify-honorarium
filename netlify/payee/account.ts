import { toBuffer } from '../lib';
import { decrypt, encrypt } from '../security';

export type AccountDetails = {
  bankBranch: string;
  accountNo: string;
  accountName: string;
};

export function serializeDetails(details: AccountDetails) {
  return encrypt(Buffer.from(JSON.stringify(details), 'utf-8'));
}

export function deserializeDetails(serialized: Buffer): AccountDetails {
  const decrypted = decrypt(toBuffer(serialized));
  const payload = decrypted.toString('utf-8');

  return JSON.parse(payload) as AccountDetails;
}

import type { Account } from '../../src/shared/schema';
import { db } from '../db';
import { keysToCamel, toBuffer } from '../lib';
import { decrypt, encrypt } from '../security';
import { findPayeeAccounts, insertAccount, type AccountData } from './repo';

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

export async function newAccount(account: AccountData, userId: number) {
  await insertAccount(db, account, userId);
}

export type RawAccount = Omit<Account, keyof AccountDetails> & { details: Buffer };

export function rowToAccount(row: RawAccount): Account {
  const account = keysToCamel(row) as Account;
  const details = deserializeDetails(row.details);

  return {
    ...account,
    ...details,
  };
}

export async function findAccounts(payeeId: number): Promise<Account[]> {
  const rows = await findPayeeAccounts(db, payeeId);
  return (rows as unknown as RawAccount[]).map(rowToAccount);
}

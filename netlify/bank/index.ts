import type { Row } from '@libsql/client';
import type { Bank, BankFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { keysToCamel } from '../lib';
import { createBank, findBanks } from './repo';

export async function newBank({ name }: BankFormValues, userId: number) {
  await createBank(db, name, userId);
}

export async function allBanks(): Promise<Bank[]> {
  const rows = await findBanks(db);
  return rows.map(rowToBank);
}

function rowToBank(row: Row) {
  return keysToCamel(row) as Bank;
}

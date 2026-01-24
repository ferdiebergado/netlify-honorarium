import type { Bank, BankFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createBank, findBanks } from './repo';

export async function newBank({ name }: BankFormValues, userId: number) {
  await createBank(db, name, userId);
}

export async function allBanks(): Promise<Bank[]> {
  return await findBanks(db);
}

import type { BankFormValues } from '../../src/shared/schema';
import { db } from '../db';
import { createBank } from './bank-repo';

export async function newBank({ name }: BankFormValues, userId: number) {
  await createBank(db, name, userId);
}

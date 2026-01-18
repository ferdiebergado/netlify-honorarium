import type { CreatePayeeFormValues, Salary, Tin } from '../../src/shared/schema';
import { db, runInTransaction } from '../db';
import { createPayee, insertAccount, insertSalary, insertTin, type AccountData } from './repo';

export async function newPayee(payee: CreatePayeeFormValues, userId: number) {
  await runInTransaction(db, createPayee, [payee, userId]);
}

export async function newAccount(account: AccountData, userId: number) {
  await insertAccount(db, account, userId);
}

export async function newSalary(salary: Omit<Salary, 'id'>, userId: number) {
  await insertSalary(db, salary, userId);
}

export async function newTin(tin: Omit<Tin, 'id'>, userId: number) {
  await insertTin(db, tin, userId);
}

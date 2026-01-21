import type { CreatePayeeFormValues, Salary, Tin } from '../../src/shared/schema';
import { db, runInTransaction } from '../db';
import { createPayee, insertSalary, insertTin } from './repo';

export async function newPayee(payee: CreatePayeeFormValues, userId: number) {
  await runInTransaction(db, createPayee, [payee, userId]);
}

export async function newSalary(salary: Omit<Salary, 'id'>, userId: number) {
  await insertSalary(db, salary, userId);
}

export async function newTin(tin: Omit<Tin, 'id'>, userId: number) {
  await insertTin(db, tin, userId);
}

import type { Config } from '@netlify/functions';
import type { Account, Payee } from '../../src/shared/schema';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { deserializeDetails } from './list-accounts';

export const payeeSql = `
SELECT 
    p.id,
    p.name,
    p.position,
    p.office,
    s.id        AS salary_id,
    s.salary,
    t.id        AS tin_id,
    t.tin,
    a.id        AS account_id,
    a.details,
    b.name      AS bank_name
FROM payees p 
JOIN salaries s ON s.payee_id = p.id 
LEFT JOIN tins t ON t.payee_id = p.id 
LEFT JOIN accounts a ON a.payee_id = p.id 
JOIN banks b ON b.id = a.bank_id`;

export type PayeeRow = {
  id: number;
  name: string;
  salary_id: number;
  salary: number;
  tin_id?: number;
  tin?: string;
  account_id: number;
  bank_name: string;
  details: Buffer;
  position: string;
  office: string;
};

export const config: Config = {
  method: 'GET',
  path: '/api/payees',
};

export default async () => {
  try {
    const sql = `${payeeSql} ORDER BY p.name`;
    const { rows } = await turso.execute(sql);
    const payeeRows = rows as unknown as PayeeRow[];

    const data = rowsToPayees(payeeRows);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

export function rowsToPayees(rows: PayeeRow[]): Payee[] {
  const payeeMap = new Map<number, Payee>();

  rows.forEach(row => {
    const {
      id,
      salary,
      tin,
      bank_name,
      name,
      details,
      salary_id,
      tin_id,
      account_id,
      position,
      office,
    } = row;
    const payee = payeeMap.get(id);
    const account: Omit<Account, 'payee' | 'payeeId'> = {
      id: account_id,
      bank: bank_name,
      ...deserializeDetails(details),
    };

    const payeeSalary = { salary, id: salary_id };
    const payeeTin = tin && tin_id && { id: tin_id, tin };

    if (!payee) {
      const payee: Payee = {
        id,
        name,
        position,
        office,
        salaries: [payeeSalary],
        accounts: [account],
      };

      if (payeeTin) payee.tins = [payeeTin];

      payeeMap.set(id, payee);
      return;
    }

    if (!payee.salaries.some(s => s.id === payeeSalary.id)) payee.salaries.push(payeeSalary);
    if (payeeTin) {
      if (!payee.tins) {
        payee.tins = [payeeTin];
      } else if (!payee.tins.some(t => t.id === payeeTin.id)) {
        payee.tins.push(payeeTin);
      }
    }
    if (!payee.accounts.some(a => a.id === account.id)) payee.accounts.push(account);
  });

  return Array.from(payeeMap.values());
}

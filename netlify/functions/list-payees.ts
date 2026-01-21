import type { Config } from '@netlify/functions';
import type { Payee } from '../../src/shared/schema';
import { db } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel } from '../lib';
import { deserializeDetails } from '../payee/account';
import { checkSession } from '../session';

export type PayeeData = Omit<Payee, 'salaries' | 'accounts' | 'tins'> & {
  salaryId: number;
  salary: number;
  tinId?: number;
  tin?: string;
  accountId: number;
  bank: string;
  details: Buffer;
};

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
    b.name      AS bank
FROM 
  payees p
JOIN
  salaries s 
ON
  s.payee_id = p.id
LEFT JOIN 
  tins t 
ON 
  t.payee_id = p.id
LEFT JOIN 
  accounts a
ON
  a.payee_id = p.id
JOIN
  banks b
ON
  b.id = a.bank_id`;

export const config: Config = {
  method: 'GET',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    await checkSession(req);

    const sql = `${payeeSql} WHERE p.deleted_at IS NULL ORDER BY p.name`;
    const { rows } = await db.execute(sql);

    const data = rowsToPayees(rows as unknown as PayeeData[]);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

export function rowsToPayees(rows: PayeeData[]): Payee[] {
  const payeeMap = new Map<number, Payee>();

  rows.forEach(row => {
    const { id, salaryId, accountId, bank, salary, tinId, tin, name, position, office } =
      keysToCamel(row) as PayeeData;

    const payee = payeeMap.get(id);
    const account: Payee['accounts'][number] = {
      id: accountId,
      bank,
      ...deserializeDetails(row.details),
    };

    const payeeSalary = { salary, id: salaryId };
    const payeeTin = tin && tinId && { id: tinId, tin };

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

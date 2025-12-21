import type { Config } from '@netlify/functions';
import type { Payee } from '../../src/features/payees/payee';
import { turso } from './db';
import { errorResponse } from './errors';

export const config: Config = {
  method: 'GET',
  path: '/api/payees',
};

export default async () => {
  try {
    const query = `
SELECT 
  p.id            AS payee_id,
  p.name,
  p.office,
  p.position,

  a.id            AS account_id,
  a.bank_id,
  a.bank_branch,
  a.account_no,
  a.account_name,
  a.tin,

  b.name          AS bank
FROM payees p
JOIN accounts a ON a.payee_id = p.id
JOIN banks b ON b.id = a.bank_id`;

    const { rows } = await turso.execute(query);
    const payeeAccountRows = rows as unknown as PayeeAccountRow[];

    const payees = mapRowsToPayees(payeeAccountRows);

    return Response.json({ data: payees });
  } catch (error) {
    return errorResponse(error);
  }
};

interface PayeeAccountRow {
  // payees
  payee_id: number;
  name: string;
  office: string;
  position: string;

  // accounts
  account_id: number;
  bank: string;
  bank_branch: string;
  account_no: string;
  account_name: string;
  tin: string;
}

function mapRowsToPayees(rows: PayeeAccountRow[]): Payee[] {
  const payees = new Map<number, Payee>();

  for (const row of rows) {
    const rowId = row.payee_id;

    let payee = payees.get(rowId);

    if (!payee) {
      payee = {
        id: rowId,
        name: row.name,
        office: row.office,
        position: row.position,
        accounts: [],
      };

      payees.set(rowId, payee);
    }

    payee.accounts.push({
      id: row.account_id,
      bank: row.bank,
      bankBranch: row.bank_branch,
      accountNo: row.account_no,
      accountName: row.account_name,
      tin: row.tin,
    });
  }

  return Array.from(payees.values());
}

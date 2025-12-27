import type { Config } from '@netlify/functions';
import type { Payee } from '../../src/lib/schema';
import { deserializeDetails } from './accounts';
import { turso } from './db';
import { errorResponse } from './errors';

interface PayeeAccountRow {
  // payees
  payee_id: number;
  name: string;
  office: string;
  position: string;

  // accounts
  account_id: number;
  bank: string;
  account_details: Buffer;
}

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
  a.details       AS account_details,

  b.name          AS bank
FROM payees p
JOIN accounts a ON a.payee_id = p.id
JOIN banks b ON b.id = a.bank_id`;

    const { rows } = await turso.execute(query);
    const payeeAccountRows = rows as unknown as PayeeAccountRow[];
    const data = mapRowsToPayees(payeeAccountRows);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

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

    const { bankBranch, accountNo, accountName } = deserializeDetails(row.account_details);

    payee.accounts.push({
      id: row.account_id,
      bank: row.bank,
      bankBranch: bankBranch,
      accountNo: accountNo,
      accountName: accountName,
    });
  }

  return Array.from(payees.values());
}

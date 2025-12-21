import type { Config } from '@netlify/functions';
import { turso } from './db';
import { respondWith } from './errors';

export const config: Config = {
  method: 'GET',
  path: '/api/payees',
};

export default async () => {
  try {
    const query = `
SELECT p.*, a.*
FROM payees p
INNER JOIN accounts a ON a.payee_id = p.id;`;

    const { rows } = await turso.execute(query);
    const data = rows.map(p => ({
      ...p,
      bankBranch: p.bank_branch,
      accountNo: p.account_no,
      accountName: p.account_name,
    }));

    return Response.json({ data });
  } catch (error) {
    respondWith(error);
  }
};

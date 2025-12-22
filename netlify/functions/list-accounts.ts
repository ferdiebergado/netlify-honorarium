import type { Config } from '@netlify/functions';
import { turso } from './db';
import { errorResponse } from './errors';

export const config: Config = {
  method: 'GET',
  path: '/api/accounts',
};

export default async () => {
  try {
    const sql = `
  SELECT 
  a.id,
  a.bank_branch,
  a.account_no,
  a.account_name, 
  p.id AS payee_id, 
  p.name AS payee_name,
  b.id AS bank_id,
  b.name AS bank_name
  FROM accounts a
  JOIN payees p ON p.id = a.payee_id
  JOIN banks b ON b.id = a.bank_id 
  ORDER BY b.name;`;

    const { rows } = await turso.execute(sql);

    const data = (rows as unknown as AccountRow[]).map(account => ({
      ...account,
      bankBranch: account.bank_branch,
      accountNo: account.account_no,
      accountName: account.account_name,
      payeeId: account.payee_id,
      payee: account.payee_name,
      bank: account.bank_name,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

type AccountRow = {
  id: number;
  bank_branch: string;
  account_no: string;
  account_name: string;
  payee_id: number;
  payee_name: string;
  bank_id: number;
  bank_name: string;
};

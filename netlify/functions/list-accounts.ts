import type { Config } from '@netlify/functions';
import type { Account } from '../../src/lib/schema';
import { deserializeDetails } from './accounts';
import { turso } from './db';
import { errorResponse } from './errors';

type AccountRow = {
  id: number;
  details: Buffer;
  payee_id: number;
  payee_name: string;
  bank_id: number;
  bank_name: string;
};

export type AccountDetails = {
  bankBranch: string;
  accountNo: string;
  accountName: string;
};

export const config: Config = {
  method: 'GET',
  path: '/api/accounts',
};

export default async () => {
  try {
    const sql = `
  SELECT 
  a.id,
  a.details,
  p.id AS payee_id, 
  p.name AS payee_name,
  b.id AS bank_id,
  b.name AS bank_name
  FROM accounts a
  JOIN payees p ON p.id = a.payee_id
  JOIN banks b ON b.id = a.bank_id 
  ORDER BY b.name;`;

    const { rows } = await turso.execute(sql);

    const accounts = (rows as unknown as AccountRow[]).map(account => ({
      ...account,
      payeeId: account.payee_id,
      payee: account.payee_name,
      bank: account.bank_name,
    }));

    const data: Account[] = accounts.map(account => {
      const details = deserializeDetails(account.details);
      return {
        ...account,
        ...details,
      };
    });

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

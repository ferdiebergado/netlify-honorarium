import type { Config } from '@netlify/functions';
import type { Account } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel } from '../lib';
import { deserializeDetails, type AccountDetails } from '../payee/account';

export type RawAccount = Omit<Account, keyof AccountDetails> & { details: Buffer };

export const accountsSql = `
SELECT
  a.id,
  a.details,
  p.id AS payee_id,
  p.name AS payee,
  b.id AS bank_id,
  b.name AS bank
FROM
  accounts a
JOIN
  payees p
ON
  p.id = a.payee_id
JOIN
  banks b
ON
  b.id = a.bank_id`;

export const config: Config = {
  method: 'GET',
  path: '/api/accounts',
};

export default async (req: Request) => {
  try {
    await authCheck(req);
    const sql = `${accountsSql} WHERE a.deleted_at IS NULL ORDER BY payee`;
    const { rows } = await db.execute(sql);

    const data = (rows as unknown as RawAccount[]).map(rowToAccount);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

export function rowToAccount(row: RawAccount): Account {
  const account = keysToCamel(row) as Account;
  const details = deserializeDetails(row.details);

  return {
    ...account,
    ...details,
  };
}

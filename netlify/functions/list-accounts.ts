import type { Config } from '@netlify/functions';
import type { Account } from '../../src/shared/schema';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { toBuffer } from '../lib';
import { decrypt } from '../security';

export type AccountRow = {
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

export const accountsSql = `
  SELECT 
  a.id,
  a.details,
  p.id AS payee_id, 
  p.name AS payee_name,
  b.id AS bank_id,
  b.name AS bank_name
  FROM accounts a
  JOIN payees p ON p.id = a.payee_id
  JOIN banks b ON b.id = a.bank_id`;

export const config: Config = {
  method: 'GET',
  path: '/api/accounts',
};

export default async () => {
  try {
    const { rows } = await turso.execute(accountsSql);

    const data = (rows as unknown as AccountRow[]).map(rowToAccount);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

export function rowToAccount(row: AccountRow): Account {
  const details = deserializeDetails(row.details);

  return {
    id: row.id,
    payeeId: row.payee_id,
    payee: row.payee_name,
    bank: row.bank_name,
    ...details,
  };
}

export function deserializeDetails(serialized: Buffer): AccountDetails {
  const decrypted = decrypt(toBuffer(serialized));
  const payload = decrypted.toString('utf-8');

  return JSON.parse(payload) as AccountDetails;
}

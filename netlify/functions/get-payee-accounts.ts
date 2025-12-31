import type { Config, Context } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { accountsSql, rowToAccount, type AccountRow } from './list-accounts';

export const config: Config = {
  method: 'GET',
  path: '/api/payees/:id/accounts',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Getting payee accounts...');

  try {
    const payeeId = parseId(ctx.params.id);

    const sql = `${accountsSql} WHERE p.id = ?`;
    const { rows } = await turso.execute(sql, [payeeId]);

    const accountRows = rows as unknown as AccountRow[];

    const data = accountRows.map(rowToAccount);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

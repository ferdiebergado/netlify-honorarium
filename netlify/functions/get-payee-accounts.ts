import type { Config, Context } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { accountsSql, rowToAccount, type RawAccount } from './list-accounts';

export const config: Config = {
  method: 'GET',
  path: '/api/payees/:id/accounts',
};

export default async (req: Request, ctx: Context) => {
  console.log('Getting payee accounts...');

  try {
    await authCheck(req);

    const payeeId = parseId(ctx.params.id);

    const sql = `${accountsSql} WHERE p.id = ?`;
    const { rows } = await db.execute(sql, [payeeId]);

    const data = (rows as unknown as RawAccount[]).map(rowToAccount);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

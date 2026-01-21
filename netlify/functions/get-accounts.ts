import type { Config, Context } from '@netlify/functions';
import { db } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { parseId } from '../lib';
import { authCheck } from '../session';
import { accountsSql, rowToAccount, type RawAccount } from './list-accounts';

export const config: Config = {
  method: 'GET',
  path: '/api/accounts/:id',
};

export default async (req: Request, ctx: Context) => {
  try {
    await authCheck(req);

    const accountId = parseId(ctx.params.id);

    const sql = `${accountsSql} WHERE a.id = ?`;
    const { rows } = await db.execute(sql, [accountId]);

    if (rows.length === 0) throw new NotFoundError();

    const data = (rows as unknown as RawAccount[]).map(rowToAccount);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config, Context } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { parseId } from '../lib';
import { accountsSql, rowToAccount, type AccountRow } from './list-accounts';

export const config: Config = {
  method: 'GET',
  path: '/api/accounts/:id',
};

export default async (req: Request, ctx: Context) => {
  try {
    await authCheck(req);

    const accountId = parseId(ctx.params.id);

    const sql = `${accountsSql} WHERE a.id = ?`;
    const { rows } = await turso.execute(sql, [accountId]);

    if (rows.length === 0) throw new NotFoundError();

    const accountRows = rows as unknown as AccountRow[];

    const data = accountRows.map(rowToAccount);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

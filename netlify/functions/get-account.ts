import type { Config, Context } from '@netlify/functions';
import { turso } from './db';
import { errorResponse, NotFoundError } from './errors';
import { accountsSql, rowToAccount, type AccountRow } from './list-accounts';

export const config: Config = {
  method: 'GET',
  path: '/api/accounts/:id',
};

export default async (_req: Request, ctx: Context) => {
  try {
    const { id } = ctx.params;

    const accountId = parseInt(id);
    if (isNaN(accountId)) throw new NotFoundError();

    const sql = `${accountsSql} WHERE a.id = ?`;
    const { rows } = await turso.execute(sql, [id]);

    if (rows.length === 0) throw new NotFoundError();

    const accountRow = rows[0] as unknown as AccountRow;

    const data = rowToAccount(accountRow);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

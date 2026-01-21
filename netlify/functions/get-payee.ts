import type { Config, Context } from '@netlify/functions';
import { db } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { authCheck } from '../session';
import { payeeSql, rowsToPayees, type PayeeData } from './list-payees';

export const config: Config = {
  method: 'GET',
  path: '/api/payees/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Getting payee...');

  try {
    await authCheck(req);

    const payeeId = parseId(ctx.params.id);

    const sql = `${payeeSql} WHERE p.id = ?`;

    const { rows } = await db.execute(sql, [payeeId]);

    const data = rowsToPayees(rows as unknown as PayeeData[])[0];

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config, Context } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { payeeSql, rowsToPayees, type PayeeRow } from './list-payees';

export const config: Config = {
  method: 'GET',
  path: '/api/payees/:id',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Getting payee...');

  try {
    const payeeId = parseId(ctx.params.id);

    const sql = `${payeeSql} WHERE p.id = ?`;

    const { rows } = await turso.execute(sql, [payeeId]);

    const payeeRows = rows as unknown as PayeeRow[];

    const data = rowsToPayees(payeeRows)[0];

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

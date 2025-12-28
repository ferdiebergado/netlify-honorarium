import type { Config, Context } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { parseId } from '../lib';
import { activitiesSql, rowToActivity, type ActivityRow } from './list-activities';

export const config: Config = {
  method: 'GET',
  path: '/api/activities/:id',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Retrieving activity with id:', ctx.params.id);

  try {
    const accountId = parseId(ctx.params.id);

    const sql = `${activitiesSql} WHERE a.id = ? AND a.deleted_at IS NULL`;
    const { rows } = await turso.execute(sql, [accountId]);

    if (rows.length === 0) throw new NotFoundError();

    const accountRows = rows as unknown as ActivityRow[];

    const data = rowToActivity(accountRows[0]);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config, Context } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { parseId } from '../lib';

export const config: Config = {
  method: 'DELETE',
  path: '/api/activities/:id',
};

export default async (_req: Request, ctx: Context) => {
  console.log('Deleting activity...');

  try {
    const activityId = parseId(ctx.params.id);
    const sql = 'UPDATE activities SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    const { rowsAffected } = await turso.execute(sql, [activityId]);

    if (rowsAffected === 0) throw new NotFoundError();

    return Response.json({ message: 'Activity deleted.' });
  } catch (error) {
    return errorResponse(error);
  }
};

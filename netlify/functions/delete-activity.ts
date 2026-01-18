import type { Config, Context } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse, NotFoundError } from '../errors';
import { parseId } from '../lib';

export const config: Config = {
  method: 'DELETE',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Deleting activity...');

  try {
    const userId = await authCheck(req);
    const activityId = parseId(ctx.params.id);
    const sql = 'UPDATE activities SET deleted_at = CURRENT_TIMESTAMP, deleted_by=? WHERE id = ?';
    const { rowsAffected } = await db.execute(sql, [userId, activityId]);

    if (rowsAffected === 0) throw new NotFoundError();

    return Response.json({ message: 'Activity deleted.' });
  } catch (error) {
    return errorResponse(error);
  }
};

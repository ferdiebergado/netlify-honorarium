import type { Config, Context } from '@netlify/functions';
import { turso } from './db';
import { errorResponse, NotFoundError } from './errors';

export const config: Config = {
  method: 'DELETE',
  path: '/api/activities/:id',
};

export default async (_req: Request, ctx: Context) => {
  try {
    const { id } = ctx.params;
    const sql = 'UPDATE activities SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    const { rowsAffected } = await turso.execute(sql, [id]);

    if (rowsAffected === 0) throw new NotFoundError();

    return Response.json({ message: 'Activity deleted.' });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config } from '@netlify/functions';
import { db } from '../db';
import { errorResponse } from '../errors';
import { authCheck } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/banks',
};

export default async (req: Request) => {
  try {
    await authCheck(req);

    const sql = 'SELECT id, name FROM banks WHERE deleted_at IS NULL ORDER BY name';
    const { rows } = await db.execute(sql);
    return Response.json({ data: rows });
  } catch (error) {
    return errorResponse(error);
  }
};

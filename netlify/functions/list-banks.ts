import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse } from '../errors';

export const config: Config = {
  method: 'GET',
  path: '/api/banks',
};

export default async (req: Request) => {
  try {
    await authCheck(req);

    const sql = 'SELECT id, name FROM banks WHERE deleted_at IS NULL ORDER BY name';
    const { rows } = await turso.execute(sql);
    return Response.json({ data: rows });
  } catch (error) {
    return errorResponse(error);
  }
};

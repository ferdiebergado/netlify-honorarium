import type { Config } from '@netlify/functions';
import { db } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel } from '../lib';
import { checkSession } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/tins',
};

export default async (req: Request) => {
  try {
    await checkSession(req);

    const sql = 'SELECT id, payee_id, tin FROM tins WHERE deleted_at IS NULL';

    const { rows } = await db.execute(sql);

    const data = rows.map(tin => keysToCamel(tin));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

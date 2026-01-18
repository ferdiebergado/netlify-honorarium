import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel } from '../lib';

export const config: Config = {
  method: 'GET',
  path: '/api/positions',
};

export default async (req: Request) => {
  console.log('Getting positions...');

  try {
    await authCheck(req);

    const query = 'SELECT id, name FROM positions WHERE deleted_at IS NULL ORDER BY name';
    const { rows } = await db.execute(query);

    const data = rows.map(row => keysToCamel(row));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

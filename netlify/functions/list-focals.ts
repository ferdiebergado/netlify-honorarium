import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse } from '../errors';

export const config: Config = {
  method: 'GET',
  path: '/api/focals',
};

export default async (req: Request) => {
  console.log('Getting focals...');

  try {
    await authCheck(req);

    const query = 'SELECT id, name, position_id FROM focals WHERE deleted_at IS NULL ORDER BY name';
    const { rows: data } = await db.execute(query);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

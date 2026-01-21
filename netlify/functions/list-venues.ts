import type { Config } from '@netlify/functions';
import { db } from '../db';
import { errorResponse } from '../errors';
import { authCheck } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/venues',
};

export default async (req: Request) => {
  try {
    await authCheck(req);

    const query = 'SELECT id, name FROM venues WHERE deleted_at IS NULL ORDER BY name';
    const { rows: data } = await db.execute(query);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

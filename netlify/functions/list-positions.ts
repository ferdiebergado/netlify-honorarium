import type { Config } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse } from '../errors';

export const config: Config = {
  method: 'GET',
  path: '/api/positions',
};

export default async () => {
  console.log('Getting positions...');

  try {
    const query = 'SELECT id, name FROM positions ORDER BY name';
    const { rows: data } = await turso.execute(query);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

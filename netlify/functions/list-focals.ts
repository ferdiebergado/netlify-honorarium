import type { Config } from '@netlify/functions';
import { turso } from './db';
import { errorResponse } from './errors';

export const config: Config = {
  method: 'GET',
  path: '/api/focals',
};

export default async () => {
  console.log('Getting focals...');

  try {
    const query = 'SELECT * FROM focals ORDER BY name';
    const { rows } = await turso.execute(query);

    return Response.json({ data: rows });
  } catch (error) {
    return errorResponse(error);
  }
};

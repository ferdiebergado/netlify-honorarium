import type { Config } from '@netlify/functions';
import { turso } from './db';
import { errorResponse } from './errors';

export const config: Config = {
  method: 'GET',
  path: '/api/roles',
};

export default async () => {
  try {
    const query = `SELECT id, name FROM roles`;

    const { rows } = await turso.execute(query);

    return Response.json({ data: rows });
  } catch (error) {
    return errorResponse(error);
  }
};

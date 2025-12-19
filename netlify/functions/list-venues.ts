import type { Config } from '@netlify/functions';
import { turso } from './db';

export const config: Config = {
  method: 'GET',
  path: '/api/venues',
};

export default async () => {
  try {
    const query = 'SELECT * FROM venues ORDER BY name';
    const { rows } = await turso.execute(query);

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

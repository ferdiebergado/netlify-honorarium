import type { Config } from '@netlify/functions';
import { turso } from './db';

export const config: Config = {
  method: 'GET',
  path: '/api/focals',
};

export default async () => {
  console.log('Getting focals...');

  try {
    const query = 'SELECT * FROM focals ORDER BY name';
    const { rows } = await turso.execute(query);

    return Response.json(rows);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import type { Config } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse } from '../errors';

export const config: Config = {
  method: 'GET',
  path: '/api/banks',
};

export default async () => {
  try {
    const sql = 'SELECT id, name FROM banks ORDER BY name';
    const { rows } = await turso.execute(sql);
    return Response.json({ data: rows });
  } catch (error) {
    return errorResponse(error);
  }
};

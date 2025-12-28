import type { Config } from '@netlify/functions';
import type { Payee } from '../../src/shared/schema';
import { turso } from '../db';
import { errorResponse } from '../errors';

export const config: Config = {
  method: 'GET',
  path: '/api/payees',
};

export default async () => {
  try {
    const query = `
SELECT 
  id,
  name,
  office,
  position
FROM payees`;

    const { rows } = await turso.execute(query);
    const data = rows as unknown as Payee[];

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config } from '@netlify/functions';
import { turso } from '../db';
import { errorResponse } from '../errors';

type TinRow = {
  id: number;
  tin: string;
  payee_id: number;
};

export const config: Config = {
  method: 'GET',
  path: '/api/tins',
};

export default async () => {
  try {
    const query = `SELECT id, payee_id, tin FROM tins`;

    const { rows } = await turso.execute(query);

    const data = (rows as unknown as TinRow[]).map(tin => ({
      ...tin,
      payeeId: tin.payee_id,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

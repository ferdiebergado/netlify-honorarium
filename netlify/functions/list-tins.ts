import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
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

export default async (req: Request) => {
  try {
    await authCheck(req);

    const sql = 'SELECT id, payee_id, tin FROM tins WHERE deleted_at IS NULL';

    const { rows } = await turso.execute(sql);

    const data = (rows as unknown as TinRow[]).map(tin => ({
      ...tin,
      payeeId: tin.payee_id,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

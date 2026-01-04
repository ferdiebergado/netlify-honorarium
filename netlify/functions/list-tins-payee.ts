import type { Config, Context } from '@netlify/functions';
import type { Tin } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';

type TinRow = {
  id: number;
  tin: string;
  payee_id: number;
};

export const config: Config = {
  method: 'GET',
  path: '/api/tins/:payee_id',
};

export default async (req: Request, ctx: Context) => {
  try {
    await authCheck(req);

    const payeeId = parseId(ctx.params.payee_id);
    const sql =
      'SELECT id, payee_id, tin FROM tins WHERE deleted_at IS NULL AND payee_id = ? ORDER BY tin';

    const { rows } = await turso.execute(sql, [payeeId]);

    const data: Tin[] = (rows as unknown as TinRow[]).map(tin => ({
      ...tin,
      payeeId: tin.payee_id,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

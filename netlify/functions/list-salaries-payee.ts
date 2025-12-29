import type { Config, Context } from '@netlify/functions';
import type { Salary } from '../../src/shared/schema';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { parseId } from '../lib';

export const config: Config = {
  method: 'GET',
  path: '/api/salaries/:payee_id',
};

type SalaryRow = {
  id: number;
  salary: number;
  payee_id: number;
};

export default async (_req: Request, ctx: Context) => {
  try {
    const payeeId = parseId(ctx.params.payee_id);
    const sql = `SELECT id, payee_id, salary FROM salaries WHERE payee_id = ? ORDER BY salary DESC`;

    const { rows } = await turso.execute(sql, [payeeId]);

    const data: Salary[] = (rows as unknown as SalaryRow[]).map(s => ({
      ...s,
      payeeId: s.payee_id,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

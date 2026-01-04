import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse } from '../errors';
export const config: Config = {
  method: 'GET',
  path: '/api/salaries',
};

type SalaryRow = {
  id: number;
  salary: number;
  payee_id: number;
};

export default async (req: Request) => {
  try {
    await authCheck(req);

    const sql = `SELECT id, payee_id, salary FROM salaries WHERE deleted_at IS NULL`;

    const { rows } = await turso.execute(sql);

    const data = (rows as unknown as SalaryRow[]).map(s => ({
      ...s,
      payeeId: s.payee_id,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

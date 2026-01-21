import type { Config, Context } from '@netlify/functions';
import { db } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel, parseId } from '../lib';
import { authCheck } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/payees/:payee_id/salaries',
};

export default async (req: Request, ctx: Context) => {
  try {
    await authCheck(req);

    const payeeId = parseId(ctx.params.payee_id);
    const sql = `
SELECT 
  id,
  payee_id,
  salary 
FROM 
  salaries 
WHERE 
  deleted_at IS NULL 
AND 
  payee_id = ?
ORDER BY 
  salary
DESC`;

    const { rows } = await db.execute(sql, [payeeId]);

    const data = rows.map(row => keysToCamel(row));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

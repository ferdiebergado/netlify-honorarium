import type { Config, Context } from '@netlify/functions';
import { db } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel, parseId } from '../lib';
import { checkSession } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/tins/:payee_id',
};

export default async (req: Request, ctx: Context) => {
  try {
    await checkSession(req);

    const payeeId = parseId(ctx.params.payee_id);
    const sql = `
SELECT 
  id,
  payee_id,
  tin
FROM
  tins 
WHERE
  deleted_at IS NULL 
AND
  payee_id = ?
ORDER BY
  tin`;

    const { rows } = await db.execute(sql, [payeeId]);

    const data = rows.map(tin => keysToCamel(tin));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

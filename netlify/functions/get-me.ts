import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, NotFoundError } from '../errors';

export const config: Config = {
  method: 'GET',
  path: '/api/auth/me',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const sql = `
SELECT
  id,
  name,
  email,
  picture
FROM
  users
WHERE
  id = ?`;

    const { rows } = await turso.execute(sql, [userId]);

    if (rows.length === 0) throw new NotFoundError();

    return Response.json({ data: rows[0] });
  } catch (error: unknown) {
    return errorResponse(error);
  }
};

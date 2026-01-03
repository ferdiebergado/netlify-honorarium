import type { Config } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, NotFoundError } from '../errors';

type UserRow = {
  id: number;
  name: string;
  email: string;
  picture: string;
};

export const config: Config = {
  method: 'GET',
  path: '/api/auth/me',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const sql = 'SELECT id, name, email, picture FROM users WHERE id = ?';
    const { rows } = await turso.execute(sql, [userId]);

    if (rows.length === 0) throw new NotFoundError();

    const data = rows[0] as unknown as UserRow;

    return Response.json({ data });
  } catch (error: unknown) {
    return errorResponse(error);
  }
};

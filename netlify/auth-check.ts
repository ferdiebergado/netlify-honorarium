import { parseCookie } from 'cookie';
import { turso } from './db';
import { UnauthorizedError } from './errors';

type SessionRow = {
  user_id: number;
};

export async function authCheck(req: Request): Promise<number> {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) throw new UnauthorizedError('no cookie header');

  const cookies = parseCookie(cookieHeader);
  const sessionId = cookies['__Secure-session'];
  if (!sessionId) throw new UnauthorizedError('no session cookie');

  const sql = 'SELECT user_id FROM sessions WHERE deleted_at IS NULL AND session_id = ?';
  const { rows } = await turso.execute(sql, [sessionId]);

  if (rows.length === 0) throw new UnauthorizedError('session not found');

  const { user_id } = rows[0] as unknown as SessionRow;

  return user_id;
}

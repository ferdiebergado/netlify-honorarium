import type { Config } from '@netlify/functions';
import { parseCookie, stringifySetCookie, type SetCookie } from 'cookie';
import { turso } from '../db';
import { errorResponse, UnauthorizedError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/auth/logout',
};

export default async (req: Request) => {
  console.log('Logging out...');

  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) throw new UnauthorizedError('no cookie header');

    const cookies = parseCookie(cookieHeader);
    const sessionId = cookies['__Secure-session'];
    if (!sessionId) throw new UnauthorizedError('no session cookie');

    const sql = `UPDATE sessions SET deleted_at=datetime('now') WHERE session_id = ?`;
    const { rowsAffected } = await turso.execute(sql, [sessionId]);

    if (rowsAffected === 0) throw new UnauthorizedError('session not found');

    const logoutCookie: SetCookie = {
      name: '__Secure-session',
      value: '',
      maxAge: -1,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    };

    const setCookieHeader = stringifySetCookie(logoutCookie);

    return Response.json(
      { message: 'Logged out.' },
      {
        headers: {
          'Set-Cookie': setCookieHeader,
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
};

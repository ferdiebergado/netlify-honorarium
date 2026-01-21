import { parseCookie } from 'cookie';
import { SESSION_COOKIE_NAME } from '../constants';
import { db } from '../db';
import { UnauthorizedError } from '../errors';
import { findSession } from './repo';

export async function authCheck(req: Request): Promise<number> {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) throw new UnauthorizedError('no cookie header');

  const cookies = parseCookie(cookieHeader);
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) throw new UnauthorizedError('no session cookie');

  return await findSession(db, sessionId);
}

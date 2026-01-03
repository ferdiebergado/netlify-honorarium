import type { Config } from '@netlify/functions';
import { parseCookie, stringifySetCookie } from 'cookie';
import { randomBytes } from 'crypto';
import { turso } from '../db';
import { BadRequestError, errorResponse, InternalServerError, UnauthorizedError } from '../errors';
import { googlePeopleAPI, oauth2Client, scopes, type GoogleUserInfo } from '../google';
import { getClientIP } from '../lib';
import { RANDOM_BYTES_SIZE, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '../constants';

export const config: Config = {
  method: 'GET',
  path: '/api/oauth/google/callback',
};

export default async (req: Request) => {
  try {
    const searchParams = new URL(req.url).searchParams;

    const code = searchParams.get('code');
    if (!code) throw new BadRequestError('missing code');

    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) throw new UnauthorizedError('Invalid cookie');

    const state = searchParams.get('state');
    const cookie = parseCookie(cookieHeader);
    if (state !== cookie.state) throw new UnauthorizedError('Invalid state');

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!scopes.every(scope => tokens.scope?.includes(scope)))
      throw new UnauthorizedError('scopes not granted');

    const res = await oauth2Client.fetch(googlePeopleAPI as string);

    if (!res.ok) throw new InternalServerError();

    console.debug('res.data:', res.data);

    const userId = await addUser(res.data as GoogleUserInfo);
    const { sessionId, maxAge } = await createSession(userId, req);

    const sessionCookie = stringifySetCookie({
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      path: '/',
      maxAge: maxAge,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return new Response(null, {
      headers: {
        Location: '/login/success',
        'Set-Cookie': sessionCookie,
      },
      status: 302,
    });
  } catch (error) {
    return errorResponse(error);
  }
};

async function addUser({ name, email, picture }: GoogleUserInfo): Promise<number> {
  console.log('Adding user...');

  const sql = `
INSERT INTO
  users
    (name, email, picture)
VALUES
  (?, ?, ?)
ON CONFLICT(email)
  DO
  UPDATE
  SET last_login_at = CURRENT_TIMESTAMP
RETURNING id`;

  const { rows } = await turso.execute(sql, [name, email, picture]);
  const { id } = rows[0] as unknown as { id: number };
  return id;
}

async function createSession(
  userId: number,
  req: Request
): Promise<{ sessionId: string; maxAge: number }> {
  console.log('Creating session...');

  const sessionId = randomBytes(RANDOM_BYTES_SIZE).toString('base64');
  const userAgent = req.headers.get('User-Agent') ?? 'unknown';
  const ip = getClientIP(req);
  const now = new Date();
  const expiresAt = new Date(now.setHours(now.getHours() + SESSION_DURATION_HOURS));
  const maxAge = Math.floor(expiresAt.getTime() / 1000);

  const sql = `
INSERT INTO
  sessions
    (session_id, user_id, ip_address, user_agent, expires_at)
VALUES
  (?, ?, ?, ?, ?)`;

  await turso.execute(sql, [sessionId, userId, ip, userAgent, expiresAt.toISOString()]);

  return { sessionId, maxAge };
}

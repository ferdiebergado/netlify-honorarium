import { randomBytes } from 'crypto';
import { RANDOM_BYTES_SIZE, SESSION_DURATION_HOURS } from './constants';
import { turso } from './db';
import { getClientIP } from './lib';

export async function createSession(
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

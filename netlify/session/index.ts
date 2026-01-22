import { parseCookie } from 'cookie';
import { randomBytes } from 'crypto';
import type { User } from '../../src/shared/schema';
import { RANDOM_BYTES_SIZE, SESSION_COOKIE_NAME, SESSION_DURATION_HOURS } from '../constants';
import { db } from '../db';
import { UnauthorizedError } from '../errors';
import { getClientIP } from '../lib';
import { upsertUser } from '../user/repo';
import { createSession, touchSession } from './repo';

export type Session = {
  sessionId: string;
  userId: number;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  maxAge: number;
};

export async function newSession(user: Omit<User, 'id'>, req: Request): Promise<Session> {
  const userId = await upsertUser(db, user);

  const sessionId = generateSessionId();
  const { expiresAt, maxAge } = setSessionDuration();
  const userAgent = req.headers.get('User-Agent') ?? 'unknown';
  const ip = getClientIP(req);

  await createSession({ sessionId, userId, expiresAt, maxAge, userAgent, ip });

  return {
    userId,
    sessionId,
    expiresAt,
    maxAge,
    userAgent,
    ip,
  };
}

export function setSessionDuration() {
  const now = new Date();
  const expiresAt = new Date(now.setHours(now.getHours() + SESSION_DURATION_HOURS));
  const maxAge = Math.floor(expiresAt.getTime() / 1000);
  return { expiresAt, maxAge };
}

export async function checkSession(req: Request): Promise<number> {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) throw new UnauthorizedError('no cookie header');

  const cookies = parseCookie(cookieHeader);
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) throw new UnauthorizedError('no session cookie');

  return await touchSession(db, sessionId);
}

function generateSessionId(): string {
  return randomBytes(RANDOM_BYTES_SIZE).toString('base64');
}

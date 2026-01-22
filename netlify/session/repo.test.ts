import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setSessionDuration, type Session } from '.';
import { type Database } from '../db';
import { assertTimestamp, seedDb, setupTestDb } from '../test-utils';
import { createSession, touchSession } from './repo';

describe('session repo', () => {
  let db: Database;

  beforeEach(async () => {
    db = await setupTestDb();
    await seedDb(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('createSession', () => {
    it('should insert a session', async () => {
      const startTime = Date.now();
      const { expiresAt, maxAge } = setSessionDuration();
      const session: Omit<Session, 'id'> = {
        sessionId: '1',
        userId: 1,
        userAgent: 'vitest',
        ip: 'localhost',
        expiresAt,
        maxAge,
      };
      await createSession(db, session);

      const sql = 'SELECT * FROM sessions WHERE session_id = ?';
      const { rows } = await db.execute(sql, [session.sessionId]);
      expect(rows.length).toBe(1);

      const newSession = rows[0];

      expect(newSession.user_id).toBe(session.userId);
      expect(newSession.ip_address).toBe(session.ip);
      expect(newSession.user_agent).toBe(session.userAgent);
      expect(newSession.expires_at).toBe(session.expiresAt.toISOString());

      assertTimestamp(newSession.last_active_at as string, startTime);
    });
  });

  describe('touchSession', () => {
    it('should touch the session', async () => {
      const startTime = Date.now();
      const { expiresAt } = setSessionDuration();
      const session: Omit<Session, 'id'> = {
        sessionId: '1',
        userId: 1,
        userAgent: 'vitest',
        ip: 'localhost',
        expiresAt: new Date(2026, 1, 22),
        maxAge: new Date(2026, 1, 22).getTime(),
      };
      await createSession(db, session);
      const userId = await touchSession(db, session.sessionId);

      expect(userId).toBeTypeOf('number');
      expect(userId).toBe(session.userId);

      const sql = 'SELECT * FROM sessions WHERE session_id = ?';
      const { rows } = await db.execute(sql, [session.sessionId]);
      expect(rows.length).toBe(1);

      const newSession = rows[0];

      assertTimestamp((newSession.last_active_at as string) + 'Z', startTime);
      assertTimestamp(newSession.expires_at as string, expiresAt.getTime());
    });
  });
});

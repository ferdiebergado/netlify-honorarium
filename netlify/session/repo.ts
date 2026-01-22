import { setSessionDuration, type Session } from '.';
import { type Database } from '../db';
import { ResourceNotFoundError } from '../errors';

export async function createSession(db: Database, session: Session): Promise<void> {
  console.log('Creating session...');

  const { userId, sessionId, expiresAt, userAgent, ip } = session;

  const sql = `
INSERT INTO
  sessions
    (
      session_id,
      user_id,
      ip_address,
      user_agent,
      expires_at
    )
VALUES
  (?, ?, ?, ?, ?)`;

  await db.execute(sql, [sessionId, userId, ip, userAgent, expiresAt.toISOString()]);
}

export async function findSession(db: Database, sessionId: string): Promise<number> {
  const sql = `
SELECT
  user_id
FROM
  sessions
WHERE
  deleted_at IS NULL
AND
  session_id = ?`;

  const { rows } = await db.execute(sql, [sessionId]);

  if (rows.length === 0)
    throw new ResourceNotFoundError(`Session with id: ${sessionId} does not exists.`);

  return rows[0].user_id as number;
}

export async function touchSession(db: Database, sessionId: string): Promise<number> {
  const sql = `
UPDATE
  sessions
SET 
  last_active_at = CURRENT_TIMESTAMP,
  expires_at = ?
WHERE 
  deleted_at IS NULL
AND
  session_id = ?
RETURNING
  user_id`;

  const { expiresAt } = setSessionDuration();
  const { rows } = await db.execute(sql, [expiresAt.toISOString(), sessionId]);

  if (rows.length === 0)
    throw new ResourceNotFoundError(`session with id: ${sessionId} does not exists.`);

  return rows[0].user_id as number;
}

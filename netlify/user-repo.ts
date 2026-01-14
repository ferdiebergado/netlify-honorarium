import type { User } from '../src/shared/schema';
import { turso } from './db';

export async function upsertUser({ id, name, email, picture }: User): Promise<number> {
  console.log('Creating user...');

  const sql = `
INSERT INTO
  users
    (google_id, name, email, picture)
VALUES
  (?, ?, ?, ?)
ON CONFLICT(google_id)
  DO
  UPDATE
  SET last_login_at = CURRENT_TIMESTAMP
RETURNING id`;

  const { rows } = await turso.execute(sql, [id, name, email, picture]);
  const row = rows[0] as unknown as { id: number };
  return row.id;
}

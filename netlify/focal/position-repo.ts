import type { Database } from '../db';

export async function createPosition(db: Database, name: string, userId: number): Promise<number> {
  const sql = `
INSERT INTO
    positions
        (
          name,
          created_by,
          updated_by
        )
VALUES 
    (?, ?, ?)
RETURNING
    id`;

  const { rows } = await db.execute(sql, [name, userId, userId]);

  if (rows.length === 0) throw new Error('Failed to insert position: no data returned.');

  return rows[0].id as number;
}

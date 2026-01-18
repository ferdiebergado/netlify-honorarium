import type { Focal } from '../../src/shared/schema';
import { type Database } from '../db';

export async function createFocal(
  db: Database,
  { name, positionId }: Pick<Focal, 'name' | 'positionId'>,
  userId: number
): Promise<number> {
  const sql = `
INSERT INTO
  focals
    (
      name,
      position_id,
      created_by,
      updated_by
    )
VALUES
  (?, ?, ?, ?) 
RETURNING
  id`;

  const { rows } = await db.execute(sql, [name, positionId, userId, userId]);

  if (rows.length === 0) throw new Error('Failed to insert focal: no data returned.');

  return rows[0].id as number;
}

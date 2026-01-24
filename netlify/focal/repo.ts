import type { Focal } from '../../src/shared/schema';
import { type Database } from '../db';
import { keysToCamel } from '../lib';

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

type FocalRow = {
  id: number;
  name: string;
  position_id: number;
};

export async function findActiveFocals(db: Database): Promise<Focal[]> {
  const query = `
SELECT
  id,
  name,
  position_id
FROM
  focals
WHERE
  deleted_at IS NULL
ORDER BY
  name`;

  const { rows } = await db.execute<FocalRow>(query);
  return rows.map(row => keysToCamel(row) as Focal);
}

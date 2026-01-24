import type { Bank } from '../../src/shared/schema';
import type { Database } from '../db';

export async function createBank(db: Database, name: string, userId: number): Promise<number> {
  const sql = `
INSERT INTO
    banks
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

  if (rows.length === 0) throw new Error('Failed to insert bank: no data returned.');

  return rows[0].id as number;
}

type BankRow = {
  id: number;
  name: string;
};

export async function findBanks(db: Database): Promise<Bank[]> {
  const sql = `
SELECT 
  id,
  name
FROM
  banks
WHERE
  deleted_at IS NULL
ORDER BY
  name`;

  const { rows } = await db.execute<BankRow>(sql);
  return rows;
}

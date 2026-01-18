import type { RoleFormValues } from '../../src/shared/schema';
import type { Database } from '../db';

export async function createRole(
  db: Database,
  role: RoleFormValues,
  userId: number
): Promise<number> {
  const sql = `
INSERT INTO
    roles 
        (
            name,
            created_by,
            updated_by
        )
VALUES
    (?, ?, ?)
RETURNING
    id`;

  const { rows } = await db.execute(sql, [role.name, userId, userId]);

  if (rows.length === 0) throw new Error('Failed to insert role: no data returned.');

  return rows[0].id as number;
}

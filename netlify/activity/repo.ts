import type { ActivityFormValues } from '../../src/shared/schema';
import { type Database } from '../db';

export async function createActivity(db: Database, data: ActivityFormValues, userId: number) {
  const { title, venueId, startDate, endDate, code, focalId } = data;
  const sql = `
INSERT INTO
  activities
    (
        title,
        venue_id,
        start_date,
        end_date,
        code,
        focal_id,
        created_by,
        updated_by
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
RETURNING 
    id`;

  const { rows } = await db.execute(sql, [
    title,
    venueId,
    startDate,
    endDate,
    code,
    focalId,
    userId,
    userId,
  ]);

  if (rows.length === 0) throw new Error('Failed to insert activity: no data returned.');

  return rows[0].id as number;
}

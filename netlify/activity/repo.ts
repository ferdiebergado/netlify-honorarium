import type { ActivityFormValues } from '../../src/shared/schema';
import { type Database } from '../db';
import { ResourceNotFoundError } from '../errors';

export async function create(db: Database, data: ActivityFormValues, userId: number) {
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

export async function softDelete(db: Database, id: number, userId: number) {
  const sql = `
UPDATE
  activities
SET
  deleted_at = CURRENT_TIMESTAMP,
  deleted_by = ?
WHERE 
  id = ?`;

  const { rowsAffected } = await db.execute(sql, [userId, id]);

  if (rowsAffected === 0)
    throw new ResourceNotFoundError(`Activity with id: ${id.toString()} not found.`);
}

export async function update(
  db: Database,
  id: number,
  data: ActivityFormValues,
  userId: number
): Promise<void> {
  const { title, venueId, startDate, endDate, code, focalId } = data;

  const sql = `
UPDATE
  activities
SET
  title = ?,
  venue_id = ?,
  start_date = ?,
  end_date = ?,
  code = ?,
  focal_id = ?,
  updated_at = CURRENT_TIMESTAMP,
  updated_by = ?
WHERE
  id = ?`;

  const { rowsAffected } = await db.execute(sql, [
    title,
    venueId,
    startDate,
    endDate,
    code,
    focalId,
    userId,
    id,
  ]);

  if (rowsAffected === 0)
    throw new ResourceNotFoundError(`Activity with id: ${id.toString()} does not exists.`);
}

export const activitiesSql = `
SELECT
  a.id,
  a.title,
  a.code,
  a.start_date,
  a.end_date,

  v.id        AS venue_id,
  v.name      as venue,

  f.id        AS focal_id,
  f.name      AS focal,

  p.id        AS position_id,
  p.name      AS position
FROM
  activities a
JOIN
  focals f
ON
  f.id = a.focal_id
JOIN
  venues v
ON
  v.id = a.venue_id
JOIN
  positions p
ON
  p.id = f.position_id
WHERE
  a.deleted_at IS NULL`;

export async function find(db: Database, id: number) {
  const sql = `${activitiesSql} AND a.id = ?`;
  const { rows } = await db.execute(sql, [id]);

  if (rows.length === 0)
    throw new ResourceNotFoundError(`Activity with id: ${id.toString()} does not exists.`);

  return rows[0];
}

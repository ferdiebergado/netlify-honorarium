import { getFundCluster } from '.';
import { type Activity, type ActivityFormValues } from '../../src/shared/schema';
import { type Database } from '../db';
import { ResourceNotFoundError } from '../errors';
import { keysToCamel, toDateRange } from '../lib';

type NewActivityRow = {
  id: number;
};

export async function create(
  db: Database,
  data: ActivityFormValues,
  userId: number
): Promise<number> {
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

  const { rows } = await db.execute<NewActivityRow>(sql, [
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

  return rows[0].id;
}

export async function softDelete(db: Database, id: number, userId: number): Promise<void> {
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

type ActivityRow = {
  id: number;
  title: string;
  code: string;
  start_date: string;
  end_date: string;
  venue_id: number;
  venue: string;
  focal_id: number;
  focal: string;
  position_id: number;
  position: string;
};

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

export async function findActiveActivity(db: Database, id: number): Promise<Activity> {
  const sql = `${activitiesSql} AND a.id = ?`;
  const { rows } = await db.execute<ActivityRow>(sql, [id]);

  if (rows.length === 0)
    throw new ResourceNotFoundError(`Activity with id: ${id.toString()} does not exists.`);

  return rowToActivity(rows[0]);
}

export async function findActiveActivities(db: Database): Promise<Activity[]> {
  const sql = `${activitiesSql} ORDER BY a.created_at DESC`;

  const { rows } = await db.execute<ActivityRow>(sql);

  return rows.map(rowToActivity);
}

function rowToActivity(row: ActivityRow): Activity {
  return {
    ...(keysToCamel(row) as Activity),
    fundCluster: getFundCluster(row.code),
    dateRange: toDateRange(row.start_date, row.end_date),
  };
}

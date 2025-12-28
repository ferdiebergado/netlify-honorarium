import type { Config } from '@netlify/functions';
import type { Activity } from '../../src/shared/schema';
import { turso } from './db';
import { errorResponse } from './errors';

export type ActivityRow = {
  id: number;
  title: string;
  code: string;
  venue_id: number;
  venue: string;
  focal_id: number;
  focal: string;
  start_date: string;
  end_date: string;
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
  f.name      as focal
FROM activities a 
JOIN focals f ON f.id = a.focal_id 
JOIN venues v ON v.id = a.venue_id
WHERE a.deleted_at IS NULL`;

export const config: Config = {
  method: 'GET',
  path: ['/api/activities'],
};

export default async () => {
  try {
    const sql = activitiesSql + ' ORDER BY a.created_at DESC';

    const { rows } = await turso.execute(sql);
    const data = (rows as unknown as ActivityRow[]).map(rowToActivity);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

export function rowToActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    venueId: row.venue_id,
    venue: row.venue,
    startDate: row.start_date,
    endDate: row.end_date,
    focal: row.focal,
    focalId: row.focal_id,
    code: row.code,
  };
}

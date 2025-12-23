import type { Config, Context } from '@netlify/functions';
import { turso } from './db';
import { errorResponse } from './errors';

export const config: Config = {
  method: 'GET',
  path: ['/api/activities', '/api/activities/:activity_id'],
};

export default async (_req: Request, ctx: Context) => {
  try {
    let sql = `
SELECT a.*, v.id AS venue_id, v.name as venue, f.id AS focal_id, f.name as focal 
FROM activities a 
JOIN focals f ON f.id = a.focal_id 
JOIN venues v ON v.id = a.venue_id
WHERE a.deleted_at IS NULL`;

    const { activity_id } = ctx.params;

    let args;
    if (activity_id) {
      sql += ' AND a.id = ?';
      args = [activity_id];
    }

    sql += ' ORDER BY a.created_at DESC';

    const { rows } = await turso.execute({ sql, args });
    const data = rows.map(a => ({
      ...a,
      venueId: a.venue_id,
      startDate: a.start_date,
      endDate: a.end_date,
      focalId: a.focal_id,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

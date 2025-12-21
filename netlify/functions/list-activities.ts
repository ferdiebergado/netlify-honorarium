import type { Config } from '@netlify/functions';
import { turso } from './db';
import { respondWith } from './errors';

export const config: Config = {
  method: 'GET',
  path: '/api/activities',
};

export default async () => {
  try {
    const query = `
SELECT a.*, v.name as venue, f.name as focal 
FROM activities a 
INNER JOIN focals f ON f.id = a.focal_id 
INNER JOIN venues v ON v.id = a.venue_id`;

    const { rows } = await turso.execute(query);
    const data = rows.map(a => ({
      ...a,
      venueId: a.venue_id,
      startDate: a.start_date,
      endDate: a.end_date,
      focalId: a.focal_id,
    }));

    return Response.json({ data });
  } catch (error) {
    respondWith(error);
  }
};

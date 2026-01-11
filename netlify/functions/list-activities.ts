import type { Config } from '@netlify/functions';
import type { Activity } from '../../src/shared/schema';
import { getFundCluster } from '../activity';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse } from '../errors';
import { keysToCamel } from '../lib';

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
  p.id = f.position_id`;

export const config: Config = {
  method: 'GET',
  path: ['/api/activities'],
};

export default async (req: Request) => {
  try {
    await authCheck(req);

    const sql = activitiesSql + ' WHERE a.deleted_at IS NULL ORDER BY a.created_at DESC';

    const { rows } = await turso.execute(sql);
    const data = rows.map(row => ({
      ...(keysToCamel(row) as Activity),
      fundCluster: getFundCluster(row['code'] as string),
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

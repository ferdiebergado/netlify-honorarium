import type { Config } from '@netlify/functions';
import { activitySchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/activities',
};

export default async (req: Request) => {
  console.log('Creating activity...');

  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = activitySchema.safeParse(body);

    if (error) throw new ValidationError();

    const { title, venueId, startDate, endDate, code, focalId } = data;
    const sql = `
INSERT INTO
  activities
    (title, venue_id, start_date, end_date, code, focal_id, created_by)
VALUES
    (?, ?, ?, ?, ?, ?, ?)`;

    await turso.execute(sql, [title, venueId, startDate, endDate, code, focalId, userId]);

    return Response.json({ message: 'Activity created.' });
  } catch (error) {
    return errorResponse(error);
  }
};

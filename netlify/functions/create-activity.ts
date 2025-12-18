import type { Config } from '@netlify/functions';
import { Activity } from '../../src/features/activities/activity';
import { turso } from './db';

export const config: Config = {
  method: 'POST',
  path: '/api/activities',
};

export default async (req: Request) => {
  console.log('creating activity...');

  try {
    const activity = (await req.json()) as Activity;

    const { title, venueId, startDate, endDate, code, fund, focalId } = activity;
    const query =
      'INSERT INTO activities (title, venue_id, start_date, end_date, code, fund, focal_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await turso.execute(query, [title, venueId, startDate, endDate, code, fund, focalId]);

    return Response.json({ message: 'activity created' });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

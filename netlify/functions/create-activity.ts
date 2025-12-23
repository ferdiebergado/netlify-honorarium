import type { Config } from '@netlify/functions';
import { schema } from './activity';
import { turso } from './db';
import { errorResponse, ValidationError } from './errors';

export const config: Config = {
  method: 'POST',
  path: '/api/activities',
};

export default async (req: Request) => {
  console.log('creating activity...');

  try {
    const body = await req.json();
    const { error, data } = schema.safeParse(body);

    if (error) throw new ValidationError();

    const { title, venueId, startDate, endDate, code, focalId } = data;
    const query =
      'INSERT INTO activities (title, venue_id, start_date, end_date, code, focal_id) VALUES (?, ?, ?, ?, ?, ?)';
    await turso.execute(query, [title, venueId, startDate, endDate, code, focalId]);

    return Response.json({ message: 'Activity created.' });
  } catch (error) {
    return errorResponse(error);
  }
};

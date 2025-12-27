import type { Config, Context } from '@netlify/functions';
import { activitySchema } from '../../src/shared/schema';
import { turso } from './db';
import { errorResponse, NotFoundError, ValidationError } from './errors';

export const config: Config = {
  method: 'PUT',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Updating activity...');

  try {
    const body = await req.json();
    const { error, data } = activitySchema.safeParse(body);

    if (error) throw new ValidationError();

    const { title, venueId, startDate, endDate, code, focalId } = data;
    const { id } = ctx.params;

    const sql = `
UPDATE activities 
SET title=?, venue_id=?, start_date=?, end_date=?, code=?, focal_id=?
WHERE id=?
`;

    const args = [title, venueId, startDate, endDate, code, focalId, id];

    const { rowsAffected } = await turso.execute({
      sql,
      args,
    });

    if (rowsAffected === 0) throw new NotFoundError();

    return Response.json({ message: 'Activity updated.' });
  } catch (error) {
    return errorResponse(error);
  }
};

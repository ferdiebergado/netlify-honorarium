import type { Config, Context } from '@netlify/functions';
import { activitySchema } from '../../src/shared/schema';
import { db } from '../db';
import { errorResponse, NotFoundError, ValidationError } from '../errors';
import { authCheck } from '../session';

export const config: Config = {
  method: 'PUT',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Updating activity...');

  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = activitySchema.safeParse(body);

    if (error) throw new ValidationError();

    const { title, venueId, startDate, endDate, code, focalId } = data;
    const { id } = ctx.params;

    const sql = `
UPDATE
  activities
SET
  title=?,
  venue_id=?,
  start_date=?,
  end_date=?,
  code=?,
  focal_id=?,
  updated_at=datetime('now'),
  updated_by=?
WHERE
  id=?`;

    const args = [title, venueId, startDate, endDate, code, focalId, userId, id];

    const { rowsAffected } = await db.execute(sql, args);

    if (rowsAffected === 0) throw new NotFoundError();

    return Response.json({ message: 'Activity updated.' });
  } catch (error) {
    return errorResponse(error);
  }
};

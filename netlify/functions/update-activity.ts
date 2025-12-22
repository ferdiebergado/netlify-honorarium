import type { Config, Context } from '@netlify/functions';
import { formSchema } from '../../src/features/activities/activity';
import { turso } from './db';
import { errorResponse, NotFoundError, ValidationError } from './errors';

export const config: Config = {
  method: 'POST',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  try {
    const body = await req.json();
    const { error, data } = formSchema.safeParse(body);

    if (error) throw new ValidationError();

    const { id } = ctx.params;
    const { title, venueId, startDate, endDate, code, focalId } = data;

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

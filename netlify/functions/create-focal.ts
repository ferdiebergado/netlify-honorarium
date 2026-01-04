import type { Config } from '@netlify/functions';
import { focalSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/focals',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = focalSchema.safeParse(body);

    if (error) throw new ValidationError();

    const { name, positionId } = data;

    const sql = 'INSERT INTO focals (name, position_id, created_by) VALUES (?, ?)';
    await turso.execute(sql, [name, positionId, userId]);

    return Response.json({ message: 'Focal person created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

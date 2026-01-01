import type { Config } from '@netlify/functions';
import { positionSchema } from '../../src/shared/schema';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/positions',
};

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { error, data } = positionSchema.safeParse(body);

    if (error) throw new ValidationError();

    const sql = 'INSERT INTO positions (name) VALUES (?)';
    await turso.execute(sql, [data.name]);

    return Response.json({ message: 'Position created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

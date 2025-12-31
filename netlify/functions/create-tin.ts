import type { Config } from '@netlify/functions';
import { tinSchema } from '../../src/shared/schema';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/tins',
};

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { error, data } = tinSchema.safeParse(body);

    if (error) throw new ValidationError();

    const { payeeId, tin } = data;

    const sql = 'INSERT INTO tins (payee_id, tin) VALUES (?, ?)';
    await turso.execute(sql, [payeeId, tin]);

    return Response.json({ message: 'TIN created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

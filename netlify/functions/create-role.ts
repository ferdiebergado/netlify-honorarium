import type { Config } from '@netlify/functions';
import { roleSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/roles',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = roleSchema.safeParse(body);

    if (error) throw new ValidationError();

    const sql = 'INSERT INTO roles (name, created_by) VALUES (?, ?)';
    await turso.execute(sql, [data.name, userId]);

    return Response.json({ message: 'Role created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

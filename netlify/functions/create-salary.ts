import type { Config } from '@netlify/functions';
import { salarySchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';

export const config: Config = {
  method: 'POST',
  path: '/api/salaries',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = salarySchema.safeParse(body);

    if (error) throw new ValidationError();

    const { payeeId, salary } = data;

    const sql = 'INSERT INTO salaries (payee_id, salary, created_by) VALUES (?, ?, ?)';
    await turso.execute(sql, [payeeId, salary, userId]);

    return Response.json({ message: 'Salary created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

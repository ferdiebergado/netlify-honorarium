import type { Config } from '@netlify/functions';
import { salarySchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';

export const config: Config = {
  method: 'POST',
  path: '/api/salaries',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);
    const { payeeId, formData } = (await req.json()) as {
      payeeId: number;
      formData: { salary: number };
    };
    const id = parseId(payeeId.toString());

    const { error, data } = salarySchema.safeParse(formData);

    if (error) throw new ValidationError();

    const sql = 'INSERT INTO salaries (payee_id, salary, created_by) VALUES (?, ?, ?)';
    await turso.execute(sql, [id, data.salary, userId]);

    return Response.json({ message: 'Salary created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

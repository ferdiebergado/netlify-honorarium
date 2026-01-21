import type { Config, Context } from '@netlify/functions';
import { salarySchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';
import { newSalary } from '../payee/service';
import { authCheck } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/payees/:id/salaries',
};

export default async (req: Request, ctx: Context) => {
  try {
    const payeeId = parseId(ctx.params.id);
    const userId = await authCheck(req);
    const body = await req.json();

    const { error, data } = salarySchema.safeParse(body);

    if (error) throw new ValidationError();

    await newSalary({ ...data, payeeId }, userId);

    return Response.json({ message: 'Salary created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

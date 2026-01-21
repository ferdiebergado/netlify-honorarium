import type { Config, Context } from '@netlify/functions';
import { tinSchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';
import { newTin } from '../payee/service';
import { authCheck } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/payees/:id/tins',
};

export default async (req: Request, ctx: Context) => {
  try {
    const payeeId = parseId(ctx.params.id);
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = tinSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newTin({ ...data, payeeId }, userId);

    return Response.json({ message: 'TIN created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

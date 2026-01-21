import type { Config, Context } from '@netlify/functions';
import { createAccountSchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';
import { newAccount } from '../payee/service';
import { authCheck } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/payees/:payeeId/accounts',
};

export default async (req: Request, ctx: Context) => {
  try {
    const payeeId = parseId(ctx.params.payeeId);
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = createAccountSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newAccount({ ...data, payeeId }, userId);

    return Response.json({ message: 'Account created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

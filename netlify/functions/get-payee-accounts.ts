import type { Config, Context } from '@netlify/functions';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { findAccounts } from '../payee/account';
import { authCheck } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/payees/:id/accounts',
};

export default async (req: Request, ctx: Context) => {
  console.log('Getting accounts of payee...');

  try {
    await authCheck(req);

    const payeeId = parseId(ctx.params.id);

    const data = await findAccounts(payeeId);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

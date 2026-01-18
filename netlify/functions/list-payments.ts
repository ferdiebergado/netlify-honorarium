import type { Config, Context } from '@netlify/functions';
import { authCheck } from '../auth-check';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { getPayments } from '../payment/payments';

export const config: Config = {
  method: 'GET',
  path: '/api/payments',
};

export default async (req: Request, ctx: Context) => {
  try {
    await authCheck(req);

    const { activity_id } = ctx.params;
    const activityId = parseId(activity_id);

    const data = await getPayments(activityId);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

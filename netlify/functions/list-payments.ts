import type { Config, Context } from '@netlify/functions';
import { errorResponse } from './errors';
import { parseId } from './lib';
import { getPayments } from './payments';

export const config: Config = {
  method: 'GET',
  path: ['/api/payments'],
};

export default async (_req: Request, ctx: Context) => {
  try {
    const { activity_id } = ctx.params;
    const activityId = parseId(activity_id);

    const data = await getPayments(activityId);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

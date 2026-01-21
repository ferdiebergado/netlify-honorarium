import type { Config, Context } from '@netlify/functions';
import { findActivity } from '../activity/service';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { checkSession } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Retrieving activity...');

  try {
    await checkSession(req);

    const id = parseId(ctx.params.id);

    const data = await findActivity(id);

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

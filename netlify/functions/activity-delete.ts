import type { Config, Context } from '@netlify/functions';
import { deleteActivity } from '../activity';
import { errorResponse } from '../errors';
import { parseId } from '../lib';
import { checkSession } from '../session';

export const config: Config = {
  method: 'DELETE',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Deleting activity...');

  try {
    const userId = await checkSession(req);
    const id = parseId(ctx.params.id);

    await deleteActivity(id, userId);

    return Response.json({ message: 'Activity deleted.' });
  } catch (error) {
    return errorResponse(error);
  }
};

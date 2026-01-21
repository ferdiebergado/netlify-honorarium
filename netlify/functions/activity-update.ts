import type { Config, Context } from '@netlify/functions';
import { activitySchema } from '../../src/shared/schema';
import { updateActivity } from '../activity/service';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';
import { authCheck } from '../session';

export const config: Config = {
  method: 'PUT',
  path: '/api/activities/:id',
};

export default async (req: Request, ctx: Context) => {
  console.log('Updating activity...');

  try {
    const userId = await authCheck(req);
    const id = parseId(ctx.params.id);

    const body = await req.json();
    const { error, data } = activitySchema.safeParse(body);

    if (error) throw new ValidationError();

    await updateActivity(id, data, userId);

    return Response.json({ message: 'Activity updated.' });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config } from '@netlify/functions';
import { activitySchema } from '../../src/shared/schema';
import { newActivity } from '../activity/service';
import { errorResponse, ValidationError } from '../errors';
import { authCheck } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/activities',
};

export default async (req: Request) => {
  console.log('Creating activity...');

  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data: activity } = activitySchema.safeParse(body);

    if (error) throw new ValidationError();

    await newActivity(activity, userId);

    return Response.json({ message: 'Activity created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

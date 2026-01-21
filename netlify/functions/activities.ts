import type { Config } from '@netlify/functions';
import { findActivities } from '../activity/service';
import { errorResponse } from '../errors';
import { authCheck } from '../session';

export const config: Config = {
  method: 'GET',
  path: ['/api/activities'],
};

export default async (req: Request) => {
  try {
    await authCheck(req);

    const data = await findActivities();

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

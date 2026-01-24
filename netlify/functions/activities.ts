import type { Config } from '@netlify/functions';
import { getActivities } from '../activity';
import { errorResponse } from '../errors';
import { checkSession } from '../session';

export const config: Config = {
  method: 'GET',
  path: ['/api/activities'],
};

export default async (req: Request) => {
  try {
    await checkSession(req);

    const data = await getActivities();

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

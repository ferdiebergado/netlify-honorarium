import type { Config } from '@netlify/functions';
import { errorResponse } from '../errors';
import { getActiveFocals } from '../focal';
import { checkSession } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/focals',
};

export default async (req: Request) => {
  console.log('Getting active focals...');

  try {
    await checkSession(req);

    const data = await getActiveFocals();

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

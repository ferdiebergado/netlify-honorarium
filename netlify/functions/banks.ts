import type { Config } from '@netlify/functions';
import { allBanks } from '../bank';
import { errorResponse } from '../errors';
import { checkSession } from '../session';

export const config: Config = {
  method: 'GET',
  path: '/api/banks',
};

export default async (req: Request) => {
  try {
    await checkSession(req);

    const data = await allBanks();
    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config } from '@netlify/functions';
import { positionSchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { newPosition } from '../focal/position';
import { checkSession } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/positions',
};

export default async (req: Request) => {
  try {
    const userId = await checkSession(req);

    const body = await req.json();
    const { error, data } = positionSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newPosition(data.name, userId);

    return Response.json({ message: 'Position created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

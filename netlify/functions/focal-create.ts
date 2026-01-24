import type { Config } from '@netlify/functions';
import { focalSchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { newFocal } from '../focal';
import { checkSession } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/focals',
};

export default async (req: Request) => {
  try {
    const userId = await checkSession(req);

    const body = await req.json();
    const { error, data: focal } = focalSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newFocal(focal, userId);

    return Response.json({ message: 'Focal person created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

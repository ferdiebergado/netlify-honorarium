import type { Config } from '@netlify/functions';
import { focalSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { errorResponse, ValidationError } from '../errors';
import { newFocal } from '../focal/service';

export const config: Config = {
  method: 'POST',
  path: '/api/focals',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = focalSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newFocal(data, userId);

    return Response.json({ message: 'Focal person created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

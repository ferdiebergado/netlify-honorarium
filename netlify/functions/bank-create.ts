import type { Config } from '@netlify/functions';
import { bankSchema } from '../../src/shared/schema';
import { newBank } from '../bank';
import { errorResponse, ValidationError } from '../errors';
import { checkSession } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/banks',
};

export default async (req: Request) => {
  try {
    const userId = await checkSession(req);

    const body = await req.json();
    const { error, data } = bankSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newBank(data, userId);

    return Response.json({ message: 'Bank created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

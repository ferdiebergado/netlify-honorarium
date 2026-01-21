import type { Config } from '@netlify/functions';
import { createPayeeSchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { newPayee } from '../payee/service';
import { checkSession } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    const userId = await checkSession(req);

    const body = await req.json();
    const { error, data: payee } = createPayeeSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newPayee(payee, userId);

    return Response.json({ message: 'Payee created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

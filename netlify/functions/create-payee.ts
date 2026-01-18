import type { Config } from '@netlify/functions';
import { createPayeeSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { errorResponse, ValidationError } from '../errors';
import { newPayee } from '../payee/service';

export const config: Config = {
  method: 'POST',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data: payee } = createPayeeSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newPayee(payee, userId);

    return Response.json({ message: 'Payee created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

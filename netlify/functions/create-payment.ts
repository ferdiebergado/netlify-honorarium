import type { Config } from '@netlify/functions';
import { paymentSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { errorResponse, ValidationError } from '../errors';
import { newPayment } from '../payment/service';

export const config: Config = {
  method: 'POST',
  path: '/api/payments',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = paymentSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newPayment(data, userId);

    return Response.json({ message: 'Payment created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

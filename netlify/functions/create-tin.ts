import type { Config } from '@netlify/functions';
import { tinSchema, type TinFormValues } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';

export const config: Config = {
  method: 'POST',
  path: '/api/tins',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const { payeeId, formData } = (await req.json()) as {
      payeeId: number;
      formData: TinFormValues;
    };
    const id = parseId(payeeId.toString());
    const { error, data } = tinSchema.safeParse(formData);

    if (error) throw new ValidationError();

    const sql = 'INSERT INTO tins (payee_id, tin, created_by) VALUES (?, ?, ?)';
    await turso.execute(sql, [id, data.tin, userId]);

    return Response.json({ message: 'TIN created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

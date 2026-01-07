import type { Config } from '@netlify/functions';
import { createAccountSchema, type CreateAccountFormValues } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';
import { parseId } from '../lib';
import { encrypt } from '../security';
import type { AccountDetails } from './list-accounts';

export const config: Config = {
  method: 'POST',
  path: '/api/accounts',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const { payeeId, formData } = (await req.json()) as {
      payeeId: number;
      formData: CreateAccountFormValues;
    };
    const id = parseId(payeeId.toString());
    const { error, data } = createAccountSchema.safeParse(formData);

    if (error) throw new ValidationError();

    const { bankId, bankBranch, accountNo, accountName } = data;

    const details: AccountDetails = { bankBranch, accountName, accountNo };
    const encryptedDetails = encrypt(Buffer.from(JSON.stringify(details), 'utf-8'));

    const sql = 'INSERT INTO accounts (payee_id, bank_id, details, created_by) VALUES (?, ?, ?, ?)';
    await turso.execute(sql, [id, bankId, encryptedDetails, userId]);

    return Response.json({ message: 'Account created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config } from '@netlify/functions';
import { createAccountSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';
import { encrypt } from '../security';
import type { AccountDetails } from './list-accounts';

export const config: Config = {
  method: 'POST',
  path: '/api/accounts',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

    const body = await req.json();
    const { error, data } = createAccountSchema.safeParse(body);

    if (error) throw new ValidationError();

    const { payeeId, bankId, bankBranch, accountNo, accountName } = data;

    const details: AccountDetails = { bankBranch, accountName, accountNo };
    const encryptedDetails = encrypt(Buffer.from(JSON.stringify(details), 'utf-8'));

    const sql = 'INSERT INTO accounts (payee_id, bank_id, details, created_by) VALUES (?, ?, ?, ?)';
    await turso.execute(sql, [payeeId, bankId, encryptedDetails, userId]);

    return Response.json({ message: 'Account created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

import type { Config } from '@netlify/functions';
import { formSchema } from '../../src/features/payees/payee';
import { turso } from './db';
import { handleError, ValidationError } from './errors';

export const config: Config = {
  method: 'POST',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { error, data } = formSchema.safeParse(body);

    if (error) throw new ValidationError();

    const { name, positionId, bank, bankBranch, accountNo, accountName, tin } = data;

    const sql = `
INSERT INTO payees (name, positionId, bank, bank_branch, account_no, account_name, tin)
VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const args = [name, positionId, bank, bankBranch, accountNo, accountName, tin];

    await turso.execute({
      sql,
      args,
    });

    return Response.json({ message: 'Payee created.' }, { status: 201 });
  } catch (error) {
    handleError(error);
  }
};

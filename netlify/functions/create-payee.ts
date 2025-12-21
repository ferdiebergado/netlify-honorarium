import type { Config } from '@netlify/functions';
import { createPayeeSchema } from '../../src/features/payees/payee';
import { turso } from './db';
import { respondWith, ValidationError } from './errors';

export const config: Config = {
  method: 'POST',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { error, data } = createPayeeSchema.safeParse(body);

    if (error) throw new ValidationError();

    const { name, office, position, salary, bankId, bankBranch, accountNo, accountName, tin } =
      data;

    const payeeSql = `
INSERT INTO payees (name, office, position) VALUES (?, ?, ?) RETURNING id`;

    const accountSql = `
INSERT INTO accounts (payee_id, salary, bank_id, bank_branch, account_no, account_name, tin)
VALUES (last_insert_rowid(), ?, ?, ?, ?, ?, ?)`;

    const payeeArgs = [name, office, position];
    const accountArgs = [salary, bankId, bankBranch, accountNo, accountName, tin];

    await turso.batch([
      {
        sql: payeeSql,
        args: payeeArgs,
      },
      {
        sql: accountSql,
        args: accountArgs,
      },
    ]);

    return Response.json({ message: 'Payee created.' }, { status: 201 });
  } catch (error) {
    respondWith(error);
  }
};

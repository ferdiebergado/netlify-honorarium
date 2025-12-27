import type { Config } from '@netlify/functions';
import { createPayeeSchema, type Payee } from '../../src/shared/schema';
import { turso } from './db';
import { errorResponse, ValidationError } from './errors';
import type { AccountDetails } from './list-accounts';
import { encrypt } from './security';

export const config: Config = {
  method: 'POST',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { error, data } = createPayeeSchema.safeParse(body);

    if (error) throw new ValidationError();

    const {
      name,
      office,
      position,
      salary,
      bankId,
      bankBranch,
      accountNo,
      accountName,
      tin = null,
    } = data;

    const payeeSql = 'INSERT INTO payees (name, office, position) VALUES (?, ?, ?) RETURNING id';
    const payeeArgs = [name, office, position];

    const { rows } = await turso.execute({
      sql: payeeSql,
      args: payeeArgs,
    });

    const [payee] = rows as unknown as Payee[];

    const details: AccountDetails = { bankBranch, accountName, accountNo };
    const encryptedDetails = encrypt(Buffer.from(JSON.stringify(details), 'utf-8'));

    const accountSql = `
INSERT INTO accounts (payee_id, bank_id, details)
VALUES (?, ?, ?)`;
    const accountArgs = [payee.id, bankId, encryptedDetails];

    const salarySql = 'INSERT INTO salaries (payee_id, salary) VALUES (?, ?)';
    const salaryArgs = [payee.id, salary];

    const tinSql = 'INSERT INTO tins (payee_id, tin) VALUES (?, ?)';
    const tinArgs = [payee.id, tin];

    await turso.batch([
      {
        sql: salarySql,
        args: salaryArgs,
      },
      {
        sql: accountSql,
        args: accountArgs,
      },
      {
        sql: tinSql,
        args: tinArgs,
      },
    ]);

    return Response.json({ message: 'Payee created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

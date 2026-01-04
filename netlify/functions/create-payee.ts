import type { Config } from '@netlify/functions';
import { createPayeeSchema, type Payee } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { turso } from '../db';
import { errorResponse, ValidationError } from '../errors';
import { encrypt } from '../security';
import type { AccountDetails } from './list-accounts';

export const config: Config = {
  method: 'POST',
  path: '/api/payees',
};

export default async (req: Request) => {
  try {
    const userId = await authCheck(req);

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

    const payeeSql =
      'INSERT INTO payees (name, office, position, created_by) VALUES (?, ?, ?, ?) RETURNING id';
    const payeeArgs = [name, office, position, userId];

    const { rows } = await turso.execute({
      sql: payeeSql,
      args: payeeArgs,
    });

    const [payee] = rows as unknown as Payee[];

    const details: AccountDetails = { bankBranch, accountName, accountNo };
    const encryptedDetails = encrypt(Buffer.from(JSON.stringify(details), 'utf-8'));

    const accountSql = `
INSERT INTO accounts (payee_id, bank_id, details, created_by)
VALUES (?, ?, ?)`;
    const accountArgs = [payee.id, bankId, encryptedDetails, userId];

    const salarySql = 'INSERT INTO salaries (payee_id, salary, created_by) VALUES (?, ?, ?)';
    const salaryArgs = [payee.id, salary, userId];

    const tinSql = 'INSERT INTO tins (payee_id, tin, created_by) VALUES (?, ?, ?)';
    const tinArgs = [payee.id, tin, userId];

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

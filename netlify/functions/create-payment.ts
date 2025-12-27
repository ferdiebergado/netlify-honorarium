import type { Config } from '@netlify/functions';
import { paymentSchema } from '../../src/shared/schema';
import { turso } from './db';
import { errorResponse, NotFoundError, ValidationError } from './errors';
import { computeHonorarium } from './payments';

export const config: Config = {
  method: 'POST',
  path: '/api/payments',
};

export default async (req: Request) => {
  try {
    const body = await req.json();
    const { error, data: payment } = paymentSchema.safeParse(body);

    if (error) throw new ValidationError();

    const {
      honorarium,
      salaryId,
      roleId,
      payeeId,
      activityId,
      taxRate,
      accountId,
      tinId = null,
    } = payment;

    const salarySql = 'SELECT salary FROM salaries WHERE id = ?';

    const { rows } = await turso.execute(salarySql, [salaryId]);

    if (rows.length === 0) throw new NotFoundError();

    const [{ salary }] = rows as unknown as { salary: number }[];

    const { actualHonorarium, hoursRendered } = computeHonorarium(honorarium, salary);
    const netHonorarium = honorarium - honorarium * (taxRate / 100);

    const sql = `
INSERT INTO payments 
(
  honorarium, 
  salary_id, 
  role_id, 
  payee_id, 
  activity_id, 
  tax_rate, 
  account_id, 
  tin_id, 
  net_honorarium, 
  actual_honorarium, 
  hours_rendered
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const args = [
      honorarium,
      salaryId,
      roleId,
      payeeId,
      activityId,
      taxRate,
      accountId,
      tinId,
      netHonorarium,
      actualHonorarium,
      hoursRendered,
    ];

    await turso.execute(sql, args);

    return Response.json({ message: 'Payment created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};

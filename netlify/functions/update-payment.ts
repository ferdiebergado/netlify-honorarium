import type { Config, Context } from '@netlify/functions';
import { paymentSchema } from '../../src/shared/schema';
import { authCheck } from '../auth-check';
import { db } from '../db';
import { errorResponse, NotFoundError, ValidationError } from '../errors';
import { parseId } from '../lib';
import { computeHonorarium } from '../payment/payments';

export const config: Config = {
  method: 'POST',
  path: '/api/payments/:id',
};

export default async (req: Request, ctx: Context) => {
  try {
    const userId = await authCheck(req);

    const paymentId = parseId(ctx.params.id);

    const body = await req.json();
    const { error, data: payment } = paymentSchema.safeParse(body);

    if (error) throw new ValidationError();

    const {
      honorarium,
      salaryId,
      roleId,
      payeeId,
      taxRate,
      activityId,
      accountId,
      tinId = null,
    } = payment;

    const salarySql = 'SELECT salary FROM salaries WHERE deleted_at IS NULL AND id = ?';

    const { rows } = await db.execute(salarySql, [salaryId]);

    if (rows.length === 0) throw new NotFoundError();

    const [{ salary }] = rows as unknown as { salary: number }[];

    const { actualHonorarium, hoursRendered, netHonorarium } = computeHonorarium(
      honorarium,
      salary,
      taxRate
    );

    const sql = `
UPDATE
  payments
SET
  honorarium=?,
  salary_id=?,
  role_id=?,
  payee_id=?,
  activity_id=?,
  tax_rate=?,
  account_id=?,
  tin_id=?,
  net_honorarium=?,
  actual_honorarium=?,
  hours_rendered=?,
  updated_at=datetime('now'),
  updated_by=?
WHERE
  id = ?`;

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
      userId,
      paymentId,
    ];

    await db.execute(sql, args);

    return Response.json({ message: 'Payment updated.' });
  } catch (error) {
    return errorResponse(error);
  }
};

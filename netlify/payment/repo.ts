import type { PaymentFormValues } from '../../src/shared/schema';
import type { Database } from '../db';
import { NotFoundError } from '../errors';
import { computeHonorarium } from '../payments';

export async function createPayment(
  db: Database,
  payment: PaymentFormValues,
  userId: number
): Promise<number> {
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

  const salarySql = 'SELECT salary FROM salaries WHERE deleted_at IS NULL AND id = ?';

  const { rows } = await db.execute(salarySql, [salaryId]);

  if (rows.length === 0) throw new NotFoundError();

  const salary = rows[0].salary as number;

  const { actualHonorarium, hoursRendered, netHonorarium } = computeHonorarium(
    honorarium,
    salary,
    taxRate
  );

  const sql = `
INSERT INTO
  payments
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
      hours_rendered,
      created_by,
      updated_by
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING
    id`;

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
    userId,
  ];

  const { rows: paymentRows } = await db.execute(sql, args);

  if (paymentRows.length === 0) throw new Error('Failed to insert payment: no data returned.');

  return paymentRows[0].id as number;
}

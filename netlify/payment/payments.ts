import type { Payment } from '../../src/shared/schema';
import { db } from '../db';
import { keysToCamel, roundMoney } from '../lib';
import { deserializeDetails } from '../payee/account';
export const SG29 = 180492;

export const paymentsSql = `
SELECT
    pay.id,
    pay.honorarium,
    pay.hours_rendered,
    pay.actual_honorarium,
    pay.net_honorarium,
    pay.updated_at,
    pay.tax_rate,

    p.id            AS payee_id,
    p.name          AS payee,
    p.office        AS payee_office,

    a.title         AS activity,
    a.id            AS activity_id,
    a.code          AS activity_code,
    a.start_date,
    a.end_date,

    r.id            AS role_id,
    r.name          AS role,

    v.name          AS venue,

    f.name          AS focal,

    pos.name        AS position,

    t.id            AS tin_id,
    t.tin,

    acc.id          AS account_id,
    acc.details     AS account_details,

    b.name          AS bank,

    s.id            AS salary_id,
    s.salary
FROM payments pay
JOIN payees p ON p.id = pay.payee_id
JOIN activities a ON a.id = pay.activity_id
JOIN roles r ON r.id = pay.role_id
JOIN venues v ON v.id = a.venue_id
JOIN focals f ON f.id = a.focal_id
JOIN positions pos ON pos.id = f.position_id
JOIN tins t ON t.id = pay.tin_id
JOIN accounts acc ON acc.id = pay.account_id
JOIN banks b ON b.id = acc.bank_id
JOIN salaries s ON s.id = pay.salary_id`;

export async function getPayments(activityId: number | null): Promise<Payment[]> {
  let sql = paymentsSql;

  if (activityId) sql += ' WHERE pay.activity_id = ?';

  const { rows } = await db.execute(sql, [activityId]);

  return rows.map(row => ({
    ...(keysToCamel(row) as Payment),
    ...deserializeDetails(row.account_details as unknown as Buffer),
  }));
}

export type Honorarium = {
  hoursRendered: number;
  actualHonorarium: number;
  netHonorarium: number;
};

export function getMaxSalary(salary: number) {
  return salary > SG29 ? SG29 : salary;
}

export function computeHonorarium(honorarium: number, salary: number, taxRate: number): Honorarium {
  const maxSalary = getMaxSalary(salary);

  let hoursRendered = 1;
  let actualHonorarium = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    actualHonorarium = 0.023 * maxSalary * hoursRendered;

    if (actualHonorarium >= honorarium) break;
    hoursRendered++;
  }

  const netHonorarium = honorarium - honorarium * (taxRate / 100);

  return {
    hoursRendered,
    actualHonorarium: roundMoney(actualHonorarium),
    netHonorarium: roundMoney(netHonorarium),
  };
}

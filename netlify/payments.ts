import type { Payment } from '../src/shared/schema';
import { turso } from './db';
import { deserializeDetails, type AccountDetails } from './functions/list-accounts';
import { roundMoney } from './lib';
export const SG29 = 180492;

export type PaymentRow = {
  id: number;
  updated_at: string;
  payee: string;
  activity: string;
  role: string;
  honorarium: number;
  hours_rendered: number;
  actual_honorarium: number;
  net_honorarium: number;
  activity_code: string;
  tax_rate: number;
  start_date: string;
  end_date: string;
  venue: string;
  focal: string;
  position: string;
  tin: string;
  bank: string;
  account_details: Buffer;
  salary: number;
};

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
    a.code          AS activity_code,
    a.start_date,
    a.end_date,     
    r.name          AS role,
    v.name          AS venue,
    f.name          AS focal,
    pos.name        AS position,
    t.tin,
    acc.details     AS account_details,
    b.name          AS bank,
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
JOIN salaries s ON s.id = pay.salary_id
`;

export async function getPayments(activityId: number | null): Promise<Payment[]> {
  let sql = paymentsSql;

  if (activityId) sql += ' WHERE pay.activity_id = ?';

  const { rows } = await turso.execute(sql, [activityId]);

  const tempData: Array<Omit<Payment, keyof AccountDetails> & { accountDetails: Buffer }> = (
    rows as unknown as PaymentRow[]
  ).map(row => ({
    ...row,
    updatedAt: row.updated_at,
    hoursRendered: row.hours_rendered,
    actualHonorarium: row.actual_honorarium,
    netHonorarium: row.net_honorarium,
    activityCode: row.activity_code,
    taxRate: row.tax_rate,
    startDate: row.start_date,
    endDate: row.end_date,
    accountDetails: row.account_details,
  }));

  const paymentsWithAccount: Payment[] = tempData.map(payment => {
    const details = deserializeDetails(payment.accountDetails);

    return {
      ...payment,
      ...details,
    };
  });

  return paymentsWithAccount;
}

export type Honorarium = {
  hoursRendered: number;
  actualHonorarium: number;
};

export function getMaxSalary(salary: number) {
  return salary > SG29 ? SG29 : salary;
}

export function computeHonorarium(honorarium: number, salary: number): Honorarium {
  const maxSalary = getMaxSalary(salary);

  let hoursRendered = 1;
  let actualHonorarium = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    actualHonorarium = 0.023 * maxSalary * hoursRendered;

    if (actualHonorarium >= honorarium) break;
    hoursRendered++;
  }

  return {
    hoursRendered,
    actualHonorarium: roundMoney(actualHonorarium),
  };
}

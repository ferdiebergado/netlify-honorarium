import { turso } from './db';

export const SG29 = 180492;

type PaymentRow = {
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
  bank_branch: string;
  account_name: string;
  account_no: string;
  salary: number;
};

export type Payment = {
  id: number;
  payee: string;
  activity: string;
  role: string;
  honorarium: number;
  updatedAt: string;
  hoursRendered: number;
  actualHonorarium: number;
  netHonorarium: number;
  activityCode: string;
  taxRate: number;
  venue: string;
  startDate: string;
  endDate: string;
  focal: string;
  position: string;
  tin: string;
  bank: string;
  bankBranch: string;
  accountName: string;
  accountNo: string;
  salary: number;
};

export async function getPayments(activityId: number | null): Promise<Payment[]> {
  let sql = `
SELECT 
    pay.id, 
    pay.honorarium, 
    pay.hours_rendered,
    pay.actual_honorarium,
    pay.net_honorarium,
    pay.updated_at, 
    pay.tax_rate,
    p.name          AS payee, 
    a.title         AS activity, 
    a.code          AS activity_code,
    a.start_date,
    a.end_date,     
    r.name          AS role,
    v.name          AS venue,
    f.name          AS focal,
    pos.name        AS position,
    t.tin,
    acc.bank_branch,
    acc.account_no,
    acc.account_name,
    b.name          AS bank,
    s.salary
FROM payments pay
LEFT JOIN payees p ON p.id = pay.payee_id
LEFT JOIN activities a ON a.id = pay.activity_id
LEFT JOIN roles r ON r.id = pay.role_id
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
LEFT JOIN positions pos ON pos.id = f.position_id
LEFT JOIN tins t ON t.id = pay.tin_id
LEFT JOIN accounts acc ON acc.payee_id = p.id
LEFT JOIN banks b ON b.id = acc.bank_id
LEFT JOIN salaries s ON s.id = pay.salary_id
`;

  if (activityId) sql += ' WHERE pay.activity_id = ?';

  const { rows: payments } = await turso.execute(sql, [activityId]);

  const data: Payment[] = (payments as unknown as PaymentRow[]).map(payment => ({
    ...payment,
    updatedAt: payment.updated_at,
    hoursRendered: payment.hours_rendered,
    actualHonorarium: payment.actual_honorarium,
    netHonorarium: payment.net_honorarium,
    activityCode: payment.activity_code,
    taxRate: payment.tax_rate,
    startDate: payment.start_date,
    endDate: payment.end_date,
    bankBranch: payment.bank_branch,
    accountName: payment.account_name,
    accountNo: payment.account_no,
  }));

  console.log('data:', data);

  return data;
}

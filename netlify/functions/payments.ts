import { turso } from './db';

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
};

type Payment = {
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
};

export type PaymentTags = {
  payee: string;
  role: string;
  activity: string;
  venue: string;
  date: string;
  end_date: string;
  amount_words: string;
  amount: string;
  tax: string;
  focal: string;
  position: string;
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
    pos.name        AS position
FROM payments pay
JOIN payees p ON p.id = pay.payee_id
JOIN activities a ON a.id = pay.activity_id
JOIN roles r ON r.id = pay.role_id
JOIN venues v ON v.id = a.venue_id
JOIN focals f ON f.id = a.focal_id
JOIN positions pos ON pos.id = f.position_id
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
  }));

  return data;
}

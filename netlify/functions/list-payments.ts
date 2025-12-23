import type { Config, Context } from '@netlify/functions';
import { turso } from './db';
import { errorResponse } from './errors';

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
};

export const config: Config = {
  method: 'GET',
  path: ['/api/payments', '/api/payments/:activity_id'],
};

export default async (_req: Request, ctx: Context) => {
  try {
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
    r.name          AS role
FROM payments pay
JOIN payees p ON p.id = pay.payee_id
JOIN activities a ON a.id = pay.activity_id
JOIN roles r ON r.id = pay.role_id
`;

    const { activity_id } = ctx.params;

    let args;

    if (activity_id) {
      sql += 'WHERE pay.activity_id = ?';
      args = [activity_id];
    }

    const { rows } = await turso.execute({
      sql,
      args,
    });

    const data: Payment[] = (rows as unknown as PaymentRow[]).map(payment => ({
      ...payment,
      updatedAt: payment.updated_at,
      hoursRendered: payment.hours_rendered,
      actualHonorarium: payment.actual_honorarium,
      netHonorarium: payment.net_honorarium,
      activityCode: payment.activity_code,
      taxRate: payment.tax_rate,
    }));

    return Response.json({ data });
  } catch (error) {
    return errorResponse(error);
  }
};
